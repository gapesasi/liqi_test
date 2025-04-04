import { Transaction } from "../../../domain/models/Transaction";

export type Status = "pending" | "processing" | "completed" | "failed";

export type CreateTransactionProps = {
  value: number;
  type: "debit" | "credit";
  origin: string;
  target: string;
  timestamp: Date;
  status: Status;
};

export type UpdateTransactionStatusProps = {
  transaction_id: string;
  status: Status;
};

export interface ITransactionRepository {
  create(props: CreateTransactionProps): Promise<Transaction>;
  updateStatus(props: UpdateTransactionStatusProps): Promise<Transaction>;
  findById(id: number): Promise<Transaction>;
  findByPeriods(startPeriod: Date, endPeriod?: Date): Promise<Transaction[]>;
  findStatusById(id: number): Promise<Status>;
}
