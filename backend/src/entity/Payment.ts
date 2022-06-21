import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amountInEur: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @ManyToOne(() => Transaction, (transaction) => transaction.payments)
  transaction: Transaction;
}
