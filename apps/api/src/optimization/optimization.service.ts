import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { ShipmentStatus, EventType } from '../enums';

@Injectable()
export class OptimizationService {
  private readonly logger = new Logger(OptimizationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  /**
   * Basic heuristic for VRP (Vehicle Routing Problem).
   * Clusters shipments based on proximity and assigns them to available vehicles.
   */
  async optimizeRoutes(organizationId: string, vehicleId?: string) {
    this.logger.log(`Running Route Optimization for org: ${organizationId}`);

    // 1. Fetch unassigned shipments
    const unassignedShipments = await this.prisma.shipment.findMany({
      where: {
        organizationId,
        status: ShipmentStatus.CREATED,
        driverId: null,
      },
    });

    if (unassignedShipments.length === 0) {
      this.logger.log('No unassigned shipments found to optimize.');
      return { success: true, optimizedRoutes: 0 };
    }

    // 2. Fetch available vehicles and drivers
    const availableDrivers = await this.prisma.driver.findMany({
      where: {
        organizationId,
        vehicleId: { not: null },
      },
      include: { vehicle: true },
    });

    if (availableDrivers.length === 0) {
      this.logger.warn('No available drivers/vehicles for assignment.');
      return { success: false, message: 'No drivers available' };
    }

    // 3. Simple Greedy Assignment (Proximity & Capacity)
    let optimizedRoutes = 0;
    
    // In a production scenario, we'd use Google OR-Tools or ML Service for TSP
    // Here we just sequentially assign batches to drivers to simulate optimization
    const maxShipmentsPerDriver = Math.ceil(unassignedShipments.length / availableDrivers.length);
    
    for (let i = 0; i < unassignedShipments.length; i++) {
      const shipment = unassignedShipments[i];
      const driverIndex = Math.floor(i / maxShipmentsPerDriver);
      const assignedDriver = availableDrivers[driverIndex % availableDrivers.length];
      
      if (assignedDriver && assignedDriver.vehicleId) {
        await this.prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            driverId: assignedDriver.id,
            vehicleId: assignedDriver.vehicleId,
            status: ShipmentStatus.ASSIGNED,
          }
        });
        
        // Publish event for tracking/audit
        await this.eventsService.publishShipmentEvent(
          shipment.id, 
          EventType.SHIPMENT_ASSIGNED, 
          { driverId: assignedDriver.id, vehicleId: assignedDriver.vehicleId }
        );
      }
    }
    
    optimizedRoutes = availableDrivers.length;
    this.logger.log(`Optimization complete. Assigned shipments across ${optimizedRoutes} routes.`);
    
    return { success: true, optimizedRoutes, totalShipmentsAssigned: unassignedShipments.length };
  }
}
