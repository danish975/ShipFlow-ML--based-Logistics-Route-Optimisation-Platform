import { Controller, Get, Post, Body, Param, Put, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { VehicleStatus } from '../enums';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.vehiclesService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.vehiclesService.findOne(id, user.organizationId);
  }

  @Post()
  create(@Body() createData: any, @CurrentUser() user: any) {
    return this.vehiclesService.create(createData, user.organizationId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.vehiclesService.update(id, updateData, user.organizationId);
  }
  
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: VehicleStatus, 
    @CurrentUser() user: any
  ) {
    return this.vehiclesService.updateStatus(id, status, user.organizationId);
  }
}
