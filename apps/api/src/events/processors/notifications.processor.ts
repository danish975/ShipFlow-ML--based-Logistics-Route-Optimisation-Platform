import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing notification job ${job.name} for ${job.data.shipmentId || job.data.userId}`);
    
    switch (job.name) {
      case 'send-delay-alert':
        // Implementation for sending SMS/Email about delay
        this.logger.log(`SMS/Email sent: Shipment ${job.data.shipmentId} is delayed.`);
        break;
      case 'send-eta-update':
        // Implementation for ETA update
        this.logger.log(`Push Notification: Shipment ${job.data.shipmentId} ETA updated.`);
        break;
      default:
        this.logger.warn(`Unknown notification job name: ${job.name}`);
    }

    return { success: true };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    this.logger.error(`Notification job ${job?.id} failed`, error.stack);
  }
}
