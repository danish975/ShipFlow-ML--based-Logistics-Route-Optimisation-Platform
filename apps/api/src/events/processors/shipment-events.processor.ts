import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('shipment-events')
export class ShipmentEventsProcessor extends WorkerHost {
  private readonly logger = new Logger(ShipmentEventsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data`, job.data);
    
    switch (job.name) {
      case 'process-event': {
        const { shipmentId, type, timestamp } = job.data;
        this.logger.log(`Handling ${type} for shipment ${shipmentId} at ${timestamp}`);
        
        // Complex logic here (e.g. updating analytics aggregations, sending emails)
        
        return { success: true, processedAt: new Date().toISOString() };
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        return null;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.debug(`Job ${job.id} has completed!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    this.logger.error(`Job ${job?.id} has failed: ${error.message}`, error.stack);
  }
}
