import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user.organizationId);
  }

  @Post()
  create(@Body() createData: any, @CurrentUser() user: any) {
    return this.ordersService.create(createData, user.organizationId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.ordersService.update(id, updateData, user.organizationId);
  }
}
