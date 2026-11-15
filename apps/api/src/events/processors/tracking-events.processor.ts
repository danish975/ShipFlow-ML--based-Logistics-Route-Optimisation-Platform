import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('tracking-events')
export class TrackingEventsProcessor extends WorkerHost {
  private readonly logger = new Logger(TrackingEventsProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { driverId, location, timestamp } = job.data;
    
    // In a real application, you might batch these inserts for high throughput
    // For now, we update the driver's current location and log the historical track.
    await this.prisma.trackingEvent.create({
      data: {
        driverId: driverId,
        latitude: location.lat,
        longitude: location.lng,
      }
    });

    return { success: true };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    this.logger.error(`Tracking event processing failed for job ${job?.id}`, error.stack);
  }
}
