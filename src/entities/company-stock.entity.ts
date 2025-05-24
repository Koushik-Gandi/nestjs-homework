import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CompanyStock {
  @PrimaryColumn()
  ticker: string;

  @Column()
  marketvalue: number;

  @Column()
  price: number;
}
