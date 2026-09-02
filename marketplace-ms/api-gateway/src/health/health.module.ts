import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { HealthCheckService } from 'src/common/health/health-check.service';

@Module({
  imports: [HealthCheckService],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
