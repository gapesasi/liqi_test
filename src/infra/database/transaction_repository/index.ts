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

  async findByPeriods(startPeriod: Date, endPeriod?: Date): Promise<Transaction[]> {
    return await this.model.query().where("timestamp").between(startPeriod, endPeriod).all().exec();
  }

  async findById(id: number): Promise<Transaction> {
    return await this.model.get({ transaction_id: id });
  }

  async findStatusById(id: number): Promise<Status> {
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
