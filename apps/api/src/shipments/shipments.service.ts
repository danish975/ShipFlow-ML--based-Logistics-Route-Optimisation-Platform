import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ShipmentStatus, EventType } from '../enums';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  /** Server-generated, human-friendly number, e.g. SHP-482913. */
  private async generateShipmentNumber(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `SHP-${randomInt(100000, 1000000)}`;
      const exists = await this.prisma.shipment.findUnique({ where: { shipmentNumber: candidate } });
      if (!exists) return candidate;
    }
    throw new ConflictException('Could not allocate a shipment number, please retry');
  }

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

  async create(data: CreateShipmentDto, organizationId: string, userId: string) {
    if (
      data.deliveryWindowStart &&
      data.deliveryWindowEnd &&
      new Date(data.deliveryWindowEnd) <= new Date(data.deliveryWindowStart)
    ) {
      throw new BadRequestException('deliveryWindowEnd must be after deliveryWindowStart');
    }

    const shipmentNumber = await this.generateShipmentNumber();

    // Use transaction to create shipment and event
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const shipment = await tx.shipment.create({
        data: {
          ...data,
          deliveryWindowStart: data.deliveryWindowStart ? new Date(data.deliveryWindowStart) : undefined,
          deliveryWindowEnd: data.deliveryWindowEnd ? new Date(data.deliveryWindowEnd) : undefined,
          shipmentNumber,
          status: ShipmentStatus.CREATED,
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
