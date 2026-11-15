import './env';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix
  // Health endpoints stay reachable outside the versioned prefix
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'api/health', method: RequestMethod.GET },
    ],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('ShipFlow API')
    .setDescription('AI-Powered Intelligent Logistics & Route Optimization Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Shipments', 'Shipment management')
    .addTag('Drivers', 'Driver management')
    .addTag('Vehicles', 'Vehicle & fleet management')
    .addTag('Routes', 'Route management & optimization')
    .addTag('Tracking', 'Real-time tracking')
    .addTag('Optimization', 'Route optimization')
    .addTag('Analytics', 'Operational analytics')
    .addTag('Predictions', 'ML predictions')
    .addTag('Notifications', 'Notification management')
    .addTag('Admin', 'Admin operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Render (and most PaaS) inject PORT; API_PORT remains the local-dev setting
  const port = process.env.PORT || process.env.API_PORT || 3002;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 ShipFlow API running on http://localhost:${port}`);
  logger.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
