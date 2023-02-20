import { IsInt, IsOptional, IsString } from 'class-validator'
import type { Relation } from 'typeorm'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import type { Payment } from './Payment'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @IsInt()
    @IsOptional()
    id: number

    @Column()
    @IsString()
    firstName: string

    @Column()
    @IsString()
    lastName: string

    @OneToMany('Payment', (payment: Payment) => payment.user)
    payments: Relation<Payment[]>
}
