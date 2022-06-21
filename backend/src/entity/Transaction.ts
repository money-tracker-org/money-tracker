import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Payment } from "./Payment";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  date: string;

  @OneToMany(() => Payment, (payment) => payment.transaction, { cascade: true })
  payments: Payment[];
}
