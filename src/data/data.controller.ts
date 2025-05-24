import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  async getData(
    @Query('ticker') ticker: string,
    @Query('dataPoint') dataPoint: string,
    @Query('table') table: string,
  ) {
    return this.dataService.getData(ticker, dataPoint, table);
  }
}
