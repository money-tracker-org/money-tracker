import { Type } from 'class-transformer'
import {
    ArrayNotEmpty,
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Payment } from './Payment'

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @IsOptional()
    id: number

    @Column()
    @IsString()
    title: string

    @Column()
    @IsString()
    date: string

    @OneToMany((type) => Payment, (payment: Payment) => payment.transaction, {
        cascade: true,
    })
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Payment)
    payments: Payment[]
}
