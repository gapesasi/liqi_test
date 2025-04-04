import { Transaction } from "../../../domain/models/Transaction";

export type Status = "pending" | "processing" | "completed" | "failed";

export type CreateTransactionProps = {
  value: number;
  type: "debit" | "credit";
  origin: string;
  target: string;
  timestamp: number;
  status: Status;
};

export type UpdateTransactionStatusProps = {
  transaction_id: string;
  status: Status;
};

export interface ITransactionRepository {
  create(props: CreateTransactionProps): Promise<Transaction>;
  updateStatus(props: UpdateTransactionStatusProps): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByPeriods(startPeriod: number, endPeriod?: number): Promise<Transaction[]>; 
  findStatusById(id: string): Promise<Status>;
}
