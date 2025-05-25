import { Injectable } from '@nestjs/common';
import {  DataSource } from 'typeorm';
import { CompanyFinancials } from '../entities/company-financials.entity';
import { CompanyStock } from '../entities/company-stock.entity';
import { CompanyInfo } from '../entities/company-info.entity';
import { CamundaService } from 'src/camunda-service/camunda.service';

@Injectable()
export class DataService {
  constructor(
    private readonly camundaService: CamundaService,
    private readonly dataSource: DataSource
  ) {}

  async getData(ticker: string, dataPoint: string, tableName: string): Promise<any> {
    // Check cache first
    const cacheKey = `${ticker}:${dataPoint}:${tableName}`;
    if ((this as any).cacheManager?.get) {
      const cached = await (this as any).cacheManager.get(cacheKey);
      if (cached !== undefined) return cached;
    }

    const decision = await this.camundaService.getTableDecision(ticker, tableName);

    // const decision = await this.ruleService.getTableDecision(tableName);

    const repositoryMap = {
      financials: CompanyFinancials,
      stock: CompanyStock,
      info: CompanyInfo
    };

   const entity = repositoryMap[decision];
    if (!entity) throw new Error('Invalid table decision');

    const repo = this.dataSource.getRepository(entity);
    const row = await repo.findOne({ where: { ticker } });

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
