import { Controller, Get, Post, Body, Param, Put, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DriverStatus } from '../enums';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.driversService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.driversService.findOne(id, user.organizationId);
  }

  @Post()
  create(@Body() createData: any, @CurrentUser() user: any) {
    return this.driversService.create(createData, user.organizationId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @CurrentUser() user: any) {
    return this.driversService.update(id, updateData, user.organizationId);
  }
  
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: DriverStatus, 
    @CurrentUser() user: any
  ) {
    return this.driversService.updateStatus(id, status, user.organizationId);
  }
}
