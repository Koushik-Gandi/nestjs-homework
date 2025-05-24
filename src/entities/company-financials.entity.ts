import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CompanyFinancials {
  @PrimaryColumn()
  ticker: string;

  @Column()
  revenue: number;

  @Column()
  income: number;
}