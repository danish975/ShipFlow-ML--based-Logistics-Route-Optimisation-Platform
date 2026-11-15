import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        const duration = Date.now() - startTime;
        this.logger.log(`[AUDIT] ${method} ${url} - ${duration}ms`);

        // Log mutating requests (POST, PUT, PATCH, DELETE) to the database
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && user) {
          // Avoid logging sensitive fields
          const sanitizedBody = { ...body };
          if (sanitizedBody.password) delete sanitizedBody.password;

          try {
            // Note: In a high-throughput system, you'd send this to a queue or separate logging service
            await this.prisma.auditLog.create({
              data: {
                userId: user.id,
                organizationId: user.organizationId,
                action: method,
                resource: url,
                resourceId: 'N/A', // Cannot determine generic resource ID from interceptor without parsing URL
                metadata: sanitizedBody,
                ipAddress: ip || 'unknown',
              }
            });
          } catch (error) {
            this.logger.error('Failed to write audit log', error);
          }
        }
      }),
    );
  }
}
