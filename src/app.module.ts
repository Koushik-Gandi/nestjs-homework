import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataController } from './data/data.controller';
import { DataService } from './data/data.service';
import { RuleEngineService } from './rules/rule-engine.service';
import { CompanyFinancials } from './entities/company-financials.entity';
import { CompanyStock } from './entities/company-stock.entity';
import { CompanyInfo } from './entities/company-info.entity';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ? process.env.DB_PORT : '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'nestdb',
      synchronize: true,
      entities: [CompanyFinancials, CompanyStock, CompanyInfo],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    }),
    TypeOrmModule.forFeature([CompanyFinancials, CompanyStock, CompanyInfo]),
  ],
  controllers: [DataController],
  providers: [DataService, RuleEngineService],
})
export class AppModule {}
