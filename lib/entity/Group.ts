import { Type } from 'class-transformer'
import {
    ArrayNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from 'class-validator'
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Group {
    @PrimaryColumn()
    @IsOptional()
    gid: string

    @IsString()
    @Column()
    @MaxLength(100)
    name: string

    @OneToMany((type) => User, (user: User) => user.group, { cascade: true })
    @ArrayNotEmpty()
    @ValidateNested()
    @Type((type) => User)
    users: User[]
}
