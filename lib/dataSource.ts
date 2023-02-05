import "reflect-metadata";
import { DataSource } from "typeorm";
import { Payment } from './entity/Payment';
import { Transaction } from './entity/Transaction';
import { User } from './entity/User';

const AppDataSourcePromise = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Transaction, Payment],
}).initialize();

export const getAppDataSource = async () => await AppDataSourcePromise;