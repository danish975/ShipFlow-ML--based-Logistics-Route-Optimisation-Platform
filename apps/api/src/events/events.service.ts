import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventType } from '../enums';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectQueue('shipment-events') private shipmentQueue: Queue,
    @InjectQueue('route-optimization') private optimizationQueue: Queue,
    @InjectQueue('eta-prediction') private etaQueue: Queue,
    @InjectQueue('risk-analysis') private riskQueue: Queue,
    @InjectQueue('notifications') private notificationQueue: Queue,
    @InjectQueue('tracking-events') private trackingQueue: Queue,
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {}

  async publishShipmentEvent(shipmentId: string, type: EventType, payload?: any) {
    this.logger.log(`Publishing ${type} for shipment ${shipmentId}`);
    
    await this.shipmentQueue.add('process-event', {
      shipmentId,
      type,
      payload,
      timestamp: new Date().toISOString()
    });
    
    // Trigger downstream processes based on event type
    if (type === EventType.LOCATION_UPDATED) {
      await this.etaQueue.add('recalculate-eta', { shipmentId });
    }
    
    if (type === EventType.DELIVERY_DELAY_DETECTED) {
      await this.riskQueue.add('assess-risk', { shipmentId });
      await this.optimizationQueue.add('evaluate-reroute', { shipmentId });
      await this.notificationQueue.add('send-delay-alert', { shipmentId });
    }
  }

  async publishTrackingUpdate(driverId: string, location: { lat: number; lng: number }) {
    await this.trackingQueue.add('process-location', {
      driverId,
      location,
      timestamp: new Date().toISOString()
    }, { 
      removeOnComplete: true, // Keep tracking queue fast
      attempts: 1 
    });
  }

  async triggerRouteOptimization(orderIds: string[], vehicleId?: string) {
    await this.optimizationQueue.add('optimize-routes', {
      orderIds,
      vehicleId,
    });
  }
}
