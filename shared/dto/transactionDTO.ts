import { PaymentDTO } from "./paymentDTO";

export interface TransactionDTO {
  id: number | undefined;
  date: string;
  title: string;
  payments: PaymentDTO[];
}
