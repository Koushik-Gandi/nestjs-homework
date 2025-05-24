import { Injectable } from '@nestjs/common';
import {  DataSource } from 'typeorm';
import { CompanyFinancials } from '../entities/company-financials.entity';
import { RuleEngineService } from '../rules/rule-engine.service';
import { CompanyStock } from '../entities/company-stock.entity';
import { CompanyInfo } from '../entities/company-info.entity';

@Injectable()
export class DataService {
  constructor(
    private readonly ruleService: RuleEngineService,
    private readonly dataSource: DataSource
  ) {}

  async getData(ticker: string, dataPoint: string, tableName: string): Promise<any> {
    // Check cache first
    const cacheKey = `${ticker}:${dataPoint}:${tableName}`;
    if ((this as any).cacheManager?.get) {
      const cached = await (this as any).cacheManager.get(cacheKey);
      if (cached !== undefined) return cached;
    }

    const decision = await this.ruleService.getTableDecision(tableName);

    const repositoryMap = {
      useCompanyFinancials: CompanyFinancials,
      useCompanyStock: CompanyStock,
      useCompanyInfo: CompanyInfo
    };

    const entity = repositoryMap[decision];
    const repository = this.dataSource.getRepository(entity);

    const row = await repository.findOne({ where: { ticker } });
    if (!row || !(dataPoint in row)) {
      throw new Error('Data not found');
    }

    // Set cache after fetching
    if ((this as any).cacheManager?.set) {
      await (this as any).cacheManager.set(cacheKey, row[dataPoint], 60);
    }

    return row[dataPoint];
  }
}
