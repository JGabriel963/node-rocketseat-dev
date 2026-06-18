import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { PostgresService } from 'src/shared/postgres.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PostgresService],
})
export class CatalogModule {}
