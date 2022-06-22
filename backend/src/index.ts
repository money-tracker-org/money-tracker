import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Transaction } from "./entity/Transaction";
import { Payment } from "./entity/Payment";
import { Request, Response } from "express";
import { TransactionDTO } from "../../shared/dto/transactionDTO";
import { PaymentDTO } from "../../shared/dto/paymentDTO";
import { UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm";
import * as cors from "cors";

AppDataSource.initialize()
  .then(async () => {
    const express = require("express");
    const app = express();
    app.use(express.json());
    app.use(cors({ methods: ["GET", "POST", "PUT"] }));
    const port = 3001;

    app.post("/user", async (req: Request, res: Response) => {
      console.log("Inserting a new user into the database...");
      const user = new User();
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      await AppDataSource.manager.save(user);
      console.log(
        "Inserted a new user into the database with id " +
          user.id +
          "First name: " +
          user.firstName +
          "Last name: " +
          user.lastName
      );
      res.json(user);
    });

    app.post("/payment", async (req: Request, res: Response) => {
      console.log("Inserting new payments into the database...");
      console.log("Inserting a new transaction into the database...");
      const transaction = new Transaction();
      const payload = req.body as TransactionDTO;
      transaction.title = payload.title;
      transaction.date = payload.date;
      const paymentPromises = payload.payments.map(
        async (x: PaymentDTO) =>
          <Payment>{
            id: undefined,
            amountInEur: x.amountInEur,
            user: await AppDataSource.manager.findOneByOrFail(User, {
              id: x.userId,
            }),
          }
      );
      transaction.payments = await Promise.all(paymentPromises);
      await AppDataSource.manager.save(transaction);

      console.log(
        "Inserted a new transaction into the database with id " + transaction.id
      );

      res.send(transaction);
    });

    app.get("/transaction", async (req: Request, res: Response) => {
      const transactionRepository = AppDataSource.getRepository(Transaction);
      console.log("Listing all transactions...");
      res.send(
        await transactionRepository.find({
          relations: ["payments", "payments.user"],
        })
      );
    });

    app.listen(port, () => {
      console.log(`Money tracker app listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
