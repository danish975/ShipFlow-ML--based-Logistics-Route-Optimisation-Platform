import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.order.findMany({
      where: { organizationId },
      include: { shipments: true },
    });
  }

  async findOne(id: string, organizationId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, organizationId },
      include: { shipments: true },
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(data: any, organizationId: string) {
    const existing = await this.prisma.order.findUnique({
      where: { orderNumber: data.orderNumber }
    });
    
    if (existing) {
      throw new ConflictException('Order with this number already exists');
    }
    
    return this.prisma.order.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async update(id: string, data: any, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }
}
