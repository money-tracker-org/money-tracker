import { Allow, IsNumber, IsOptional } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Transaction } from './Transaction'
import { User } from './User'

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id: number

    @Column({ type: "decimal", precision: 10 })
    @IsNumber()
    amountInEur: number

    @ManyToOne(() => User, (user: User) => user.payments)
    @Allow()
    user: User

    @ManyToOne(
        'Transaction',
        (transaction: Transaction) => transaction.payments
    )
    @Allow()
    transaction: Transaction
}
