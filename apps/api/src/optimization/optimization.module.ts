import { Module } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { EventsModule } from '../events/events.module';
import { PrismaModule } from '../prisma/prisma.module';
import { OptimizationController } from './optimization.controller';

@Module({
  imports: [EventsModule, PrismaModule],
  providers: [OptimizationService],
  controllers: [OptimizationController],
  exports: [OptimizationService],
})
export class OptimizationModule {}
