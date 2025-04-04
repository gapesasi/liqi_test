import { ModelType } from "dynamoose/dist/General";
import { Transaction } from "../../../domain/models/Transaction";
import {
  CreateTransactionProps,
  ITransactionRepository,
  UpdateTransactionStatusProps,
} from "./interface";

export default class TransactionRepository implements ITransactionRepository {
  constructor(private readonly model: ModelType<Transaction>) {}

  async updateStatus({
    transaction_id,
    status,
  }: UpdateTransactionStatusProps): Promise<Transaction> {
    return await this.model.update({ transaction_id }, { $SET: { status } });
  }

  async create(props: CreateTransactionProps): Promise<Transaction> {
    return await this.model.create({
      ...props,
    });
  }
}
