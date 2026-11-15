import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleStatus } from '../enums';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.vehicle.findMany({
      where: { organizationId },
      include: { driver: true },
    });
  }

  async findOne(id: string, organizationId: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, organizationId },
      include: { driver: true },
    });
    
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async create(data: any, organizationId: string) {
    const existing = await this.prisma.vehicle.findUnique({
      where: { vehicleNumber: data.vehicleNumber }
    });
    
    if (existing) {
      throw new ConflictException('Vehicle with this number already exists');
    }
    
    return this.prisma.vehicle.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async update(id: string, data: any, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.vehicle.update({
      where: { id },
      data,
    });
  }
  
  async updateStatus(id: string, status: VehicleStatus, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.vehicle.update({
      where: { id },
      data: { status }
    });
  }
}
