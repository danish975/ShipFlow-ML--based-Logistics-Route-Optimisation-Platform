import { Controller, Get, Post, Body, Param, Put, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ShipmentStatus } from '../enums';

@ApiTags('Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.shipmentsService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.shipmentsService.findOne(id, user.organizationId);
  }

  @Post()
  create(@Body() createData: any, @CurrentUser() user: any) {
    return this.shipmentsService.create(createData, user.organizationId, user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.shipmentsService.update(id, updateData, user.organizationId, user.id);
  }
  
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: ShipmentStatus, 
    @CurrentUser() user: any
  ) {
    return this.shipmentsService.updateStatus(id, status, user.organizationId, user.id);
  }
}
