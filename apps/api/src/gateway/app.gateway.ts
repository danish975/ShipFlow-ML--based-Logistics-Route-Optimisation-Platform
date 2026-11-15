import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { EventsService } from '../events/events.service';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict to frontend URL
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AppGateway.name);

  constructor(private readonly eventsService: EventsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Extract user/driver info from token if available, then join specific rooms
    const organizationId = client.handshake.query.organizationId;
    if (organizationId) {
      client.join(`org_${organizationId}`);
      this.logger.log(`Client ${client.id} joined room org_${organizationId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('driver_location_update')
  async handleLocationUpdate(
    @MessageBody() data: { driverId: string; organizationId: string; lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Process the location asynchronously via BullMQ tracking-events processor
    await this.eventsService.publishTrackingUpdate(data.driverId, { lat: data.lat, lng: data.lng });

    // Emit real-time update to the organization's dashboard room
    this.server.to(`org_${data.organizationId}`).emit('fleet_location_updated', {
      driverId: data.driverId,
      lat: data.lat,
      lng: data.lng,
      timestamp: new Date().toISOString()
    });

    return { status: 'acknowledged' };
  }

  // Method to push ML alerts to the dashboard
  broadcastAlert(organizationId: string, alert: any) {
    this.server.to(`org_${organizationId}`).emit('ml_alert', alert);
  }
}
