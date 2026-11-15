import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ShipmentStatus, EventType } from '../enums';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.shipment.findMany({
      where: { organizationId },
      include: {
        driver: { include: { user: true } },
        vehicle: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, organizationId: string) {
    const shipment = await this.prisma.shipment.findFirst({
      where: { id, organizationId },
      include: {
        driver: { include: { user: true } },
        vehicle: true,
        order: true,
        events: { orderBy: { createdAt: 'desc' } },
        trackingEvents: { orderBy: { timestamp: 'desc' }, take: 10 }
      },
    });
    
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return shipment;
  }

  async create(data: any, organizationId: string, userId: string) {
    const existing = await this.prisma.shipment.findUnique({
      where: { shipmentNumber: data.shipmentNumber }
    });
    
    if (existing) {
      throw new ConflictException('Shipment with this number already exists');
    }
    
    // Use transaction to create shipment and event
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const shipment = await tx.shipment.create({
        data: {
          ...data,
          organizationId,
        },
      });
      
      await tx.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,
          eventType: EventType.SHIPMENT_CREATED,
          userId,
          description: 'Shipment created'
        }
      });
      
      return shipment;
    });
  }

  async update(id: string, data: any, organizationId: string, userId: string) {
    await this.findOne(id, organizationId);
    
    return this.prisma.shipment.update({
      where: { id },
      data,
    });
  }
  
  async updateStatus(id: string, status: ShipmentStatus, organizationId: string, userId: string) {
    const shipment = await this.findOne(id, organizationId);
    
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedShipment = await tx.shipment.update({
        where: { id },
        data: { status }
      });
      
      let eventType: EventType = EventType.SHIPMENT_CREATED;
      
      switch (status) {
        case ShipmentStatus.ASSIGNED: eventType = EventType.SHIPMENT_ASSIGNED; break;
        case ShipmentStatus.PICKED_UP: eventType = EventType.SHIPMENT_DISPATCHED; break;
        case ShipmentStatus.DELIVERED: eventType = EventType.DELIVERY_COMPLETED; break;
        case ShipmentStatus.FAILED: eventType = EventType.DELIVERY_FAILED; break;
        case ShipmentStatus.DELAYED: eventType = EventType.DELIVERY_DELAY_DETECTED; break;
        default: eventType = EventType.MANUAL_OVERRIDE;
      }
      
      await tx.shipmentEvent.create({
        data: {
          shipmentId: id,
          eventType,
          userId,
          description: `Status updated to ${status}`
        }
      });
      
      return updatedShipment;
    });
  }
}
