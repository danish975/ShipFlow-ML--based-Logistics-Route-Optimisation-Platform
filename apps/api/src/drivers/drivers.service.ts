import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DriverStatus } from '../enums';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.driver.findMany({
      where: { organizationId },
      include: { user: true, vehicle: true },
    });
  }

  async findOne(id: string, organizationId: string) {
    const driver = await this.prisma.driver.findFirst({
      where: { id, organizationId },
      include: { user: true, vehicle: true },
    });
    
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async create(data: any, organizationId: string) {
    // Basic implementation; relies on auth service for full user creation ideally,
    // or assumes user is already created and we're just creating the driver profile.
    const existing = await this.prisma.driver.findUnique({
      where: { employeeId: data.employeeId }
    });
    
    if (existing) {
      throw new ConflictException('Driver with this employee ID already exists');
    }
    
    return this.prisma.driver.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async update(id: string, data: any, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.driver.update({
      where: { id },
      data,
    });
  }
  
  async updateStatus(id: string, status: DriverStatus, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.driver.update({
      where: { id },
      data: { status }
    });
  }
}
