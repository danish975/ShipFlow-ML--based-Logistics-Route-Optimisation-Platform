import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ShipmentEventsProcessor } from './processors/shipment-events.processor';
import { TrackingEventsProcessor } from './processors/tracking-events.processor';
import { NotificationsProcessor } from './processors/notifications.processor';
import { AnalyticsProcessor } from './processors/analytics.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'shipment-events' },
      { name: 'route-optimization' },
      { name: 'eta-prediction' },
      { name: 'risk-analysis' },
      { name: 'notifications' },
      { name: 'tracking-events' },
      { name: 'analytics' },
    ),
  ],
  controllers: [EventsController],
  providers: [
    EventsService, 
    ShipmentEventsProcessor,
    TrackingEventsProcessor,
    NotificationsProcessor,
    AnalyticsProcessor
  ],
  exports: [EventsService],
})
export class EventsModule {}
