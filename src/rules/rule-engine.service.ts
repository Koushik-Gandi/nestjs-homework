import { Injectable } from '@nestjs/common';
import { Engine } from 'json-rules-engine';
import * as rules from './rules.json';

@Injectable()
export class RuleEngineService {
  private engine: Engine;

  constructor() {
    this.engine = new Engine(rules);
  }

  async getTableDecision(tableName: string): Promise<string> {
    const result = await this.engine.run({ tableName });
    const event = result.events[0];
    return event?.type;
  }
}
