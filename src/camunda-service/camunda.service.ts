import { Injectable } from '@nestjs/common';
import { ZBClient } from 'zeebe-node';

@Injectable()
export class CamundaService {
  private zb: ZBClient;

  constructor() {
    this.zb = new ZBClient('', {
      camundaCloud: {
        clientId: process.env.ZEEBE_CLIENT_ID ?? (() => { throw new Error('ZEEBE_CLIENT_ID is not defined'); })(),
        clientSecret: process.env.ZEEBE_CLIENT_SECRET ?? (() => { throw new Error('ZEEBE_CLIENT_SECRET is not defined'); })(),
        clusterId: process.env.ZEEBE_CLUSTER_ID ?? (() => { throw new Error('ZEEBE_CLUSTER_ID is not defined'); })(),
      },
    });
  }

  async getTableDecision(ticker: string, tableName: string): Promise<string> {
    const result = await this.zb.createProcessInstanceWithResult({
      bpmnProcessId: 'determine-table-process',
      variables: {
        ticker,
        tableName,
      },
    });

    return result.variables.tableDecision;
  }
}