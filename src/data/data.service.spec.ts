import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataService } from './data.service';
import { CompanyFinancials } from '../entities/company-financials.entity';
import { CompanyStock } from '../entities/company-stock.entity';
import { CompanyInfo } from '../entities/company-info.entity';
import { RuleEngineService } from '../rules/rule-engine.service';
import { DataSource } from 'typeorm';

describe('DataService', () => {
  let service: DataService;
  let financialsRepo: any;
  let stockRepo: any;
  let infoRepo: any;
  let cacheManager: any;
  let ruleEngine: any;
  let dataSource: any;

  beforeEach(async () => {
    financialsRepo = { findOne: jest.fn() };
    stockRepo = { findOne: jest.fn() };
    infoRepo = { findOne: jest.fn() };
    cacheManager = { get: jest.fn(), set: jest.fn() };
    ruleEngine = { getTableDecision: jest.fn() };
    dataSource = {
      getRepository: jest.fn((entity) => {
        if (entity === CompanyFinancials) return financialsRepo;
        if (entity === CompanyStock) return stockRepo;
        if (entity === CompanyInfo) return infoRepo;
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        { provide: 'CACHE_MANAGER', useValue: cacheManager },
        { provide: getRepositoryToken(CompanyFinancials), useValue: financialsRepo },
        { provide: getRepositoryToken(CompanyStock), useValue: stockRepo },
        { provide: getRepositoryToken(CompanyInfo), useValue: infoRepo },
        { provide: RuleEngineService, useValue: ruleEngine },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    (service as any).cacheManager = cacheManager;
    (service as any).ruleEngine = ruleEngine;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached value if present', async () => {
    cacheManager.get.mockResolvedValue('cached-value');
    const result = await service.getData('AAPL', 'revenue', 'financials');
    expect(result).toBe('cached-value');
    expect(cacheManager.get).toHaveBeenCalled();
    expect(financialsRepo.findOne).not.toHaveBeenCalled();
    expect(stockRepo.findOne).not.toHaveBeenCalled();
    expect(infoRepo.findOne).not.toHaveBeenCalled();
  });

  it('should fetch CompanyFinancials if not cached', async () => {
    cacheManager.get.mockResolvedValue(undefined);
    ruleEngine.getTableDecision.mockResolvedValue('useCompanyFinancials');
    financialsRepo.findOne.mockResolvedValue({ ticker: 'AAPL', revenue: 100 });
    const result = await service.getData('AAPL', 'revenue', 'financials');
    expect(result).toBe(100);
    expect(financialsRepo.findOne).toHaveBeenCalledWith({ where: { ticker: 'AAPL' } });
    expect(cacheManager.set).toHaveBeenCalledWith('AAPL:revenue:financials', 100, 60);
  });

  it('should fetch CompanyStock if not cached', async () => {
    cacheManager.get.mockResolvedValue(undefined);
    ruleEngine.getTableDecision.mockResolvedValue('useCompanyStock');
    stockRepo.findOne.mockResolvedValue({ ticker: 'AAPL', price: 200 });
    const result = await service.getData('AAPL', 'price', 'stock');
    expect(result).toBe(200);
    expect(stockRepo.findOne).toHaveBeenCalledWith({ where: { ticker: 'AAPL' } });
    expect(cacheManager.set).toHaveBeenCalledWith('AAPL:price:stock', 200, 60);
  });

  it('should fetch CompanyInfo if not cached', async () => {
    cacheManager.get.mockResolvedValue(undefined);
    ruleEngine.getTableDecision.mockResolvedValue('useCompanyInfo');
    infoRepo.findOne.mockResolvedValue({ ticker: 'AAPL', name: 'Apple Inc.' });
    const result = await service.getData('AAPL', 'name', 'info');
    expect(result).toBe('Apple Inc.');
    expect(infoRepo.findOne).toHaveBeenCalledWith({ where: { ticker: 'AAPL' } });
    expect(cacheManager.set).toHaveBeenCalledWith('AAPL:name:info', 'Apple Inc.', 60);
  });

  it('should throw error if row not found', async () => {
    cacheManager.get.mockResolvedValue(undefined);
    ruleEngine.getTableDecision.mockResolvedValue('useCompanyStock');
    stockRepo.findOne.mockResolvedValue(undefined);
    await expect(service.getData('AAPL', 'price', 'stock')).rejects.toThrow('Data not found');
    expect(stockRepo.findOne).toHaveBeenCalledWith({ where: { ticker: 'AAPL' } });
    expect(cacheManager.set).not.toHaveBeenCalled();
  });
});
