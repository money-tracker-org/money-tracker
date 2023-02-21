import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Group } from './entity/Group'
import { Payment } from './entity/Payment'
import { Transaction } from './entity/Transaction'
import { User } from './entity/User'

const AppDataSourcePromise = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [Group, Payment, Transaction, User],
}).initialize()

export const getAppDataSource = async () => await AppDataSourcePromise
