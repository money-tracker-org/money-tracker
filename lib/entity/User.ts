import { Allow, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import type { Relation } from 'typeorm';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import type { Group } from './Group';
import type { Payment } from './Payment';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @IsInt()
    @IsOptional()
    id: number

    @Column()
    @IsString()
    displayName: string

    @Column('boolean', { default: false })
    @IsBoolean()
    @IsOptional()
    disabled: boolean

    @OneToMany('Payment', (payment: Payment) => payment.user)
    payments: Relation<Payment[]>

    @ManyToOne('Group', (group: Group) => group.users)
    @Allow()
    group: Relation<Group>
}
