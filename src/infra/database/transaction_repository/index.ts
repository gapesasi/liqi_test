import { ModelType } from "dynamoose/dist/General";
import { Transaction } from "../../../domain/models/Transaction";
import {
  CreateTransactionProps,
  ITransactionRepository,
  Status,
  UpdateTransactionStatusProps,
} from "./interface";

export default class TransactionRepository implements ITransactionRepository {
  constructor(private readonly model: ModelType<Transaction>) {}

  async findByPeriods(startPeriod: number, endPeriod?: number): Promise<Transaction[]> {
    if (!endPeriod) {
      return await this.model
        .scan("timestamp")
        .using("transaction_timestamp_index")
        .ge(startPeriod)
        .all()
        .exec();
    }

    return await this.model
      .scan("timestamp")
      .using("transaction_timestamp_index")
      .between(startPeriod, endPeriod)
      .all()
      .exec();
  }

  async findById(id: string): Promise<Transaction> {
    return await this.model.get({ transaction_id: id });
  }

  async findStatusById(id: string): Promise<Status> {
    const value = await this.model.get({ transaction_id: id }, { attributes: ["status"] });
    return value.status;
  }

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
