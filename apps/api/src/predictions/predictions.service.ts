import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PredictionsService {
  private readonly logger = new Logger(PredictionsService.name);
  private readonly mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async predictEta(shipmentId: string, features: any) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.mlServiceUrl}/predict/eta`, features)
      );
      
      const { predicted_eta_minutes, confidence, model_version } = response.data;
      
      // Save prediction to DB
      await this.prisma.prediction.create({
        data: {
          shipmentId,
          modelType: 'ETA', // Assuming 'ETA' is valid for PredictionModelType string field
          modelVersion: model_version,
          predictedValue: predicted_eta_minutes,
          confidence,
          features,
        }
      });
      
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to predict ETA: ${error.message}`);
      throw error;
    }
  }

  async predictRisk(shipmentId: string, features: any) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.mlServiceUrl}/predict/risk`, features)
      );
      
      const { risk_score, risk_level, confidence, model_version } = response.data;
      
      await this.prisma.riskAssessment.create({
        data: {
          shipmentId,
          riskScore: risk_score,
          riskLevel: risk_level,
          factors: features,
          modelVersion: model_version,
        }
      });
      
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to predict risk: ${error.message}`);
      throw error;
    }
  }
}
