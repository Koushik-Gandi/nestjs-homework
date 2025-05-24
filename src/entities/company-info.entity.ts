import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CompanyInfo {
  @PrimaryColumn()
  ticker: string;

  @Column()
  name: string;

  @Column()
  industry: string;
}
