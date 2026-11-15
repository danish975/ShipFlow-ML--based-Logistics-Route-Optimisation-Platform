import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OptimizationService } from './optimization.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Optimization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('optimization')
export class OptimizationController {
  constructor(private readonly optService: OptimizationService) {}

  @Post('run')
  runOptimization(@CurrentUser() user: any) {
    return this.optService.optimizeRoutes(user.organizationId);
  }
}
