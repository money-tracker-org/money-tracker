import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Transaction } from "./entity/Transaction";
import { Payment } from "./entity/Payment";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Transaction, Payment],
});
