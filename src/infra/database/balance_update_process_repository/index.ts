import { ModelType } from "dynamoose/dist/General";
import { BalanceUpdateProcess } from "../../../domain/models/BalanceUpdateProcess";
import {
  CreateBalanceUpdateProcessProps,
  IBalanceUpdateProcessRepository,
  UpdateBalanceUpdateProcessProps,
} from "./interface";

export default class BalanceUpdateProcessRepository implements IBalanceUpdateProcessRepository {
  constructor(private readonly model: ModelType<BalanceUpdateProcess>) {}

  async create(props: CreateBalanceUpdateProcessProps): Promise<BalanceUpdateProcess> {
    return await this.model.create({
      ...props,
    });
  }

  async findByTransactionId(transaction_id: string): Promise<BalanceUpdateProcess | null> {
    return await this.model.get({ transaction_id });
  }

  async update(props: UpdateBalanceUpdateProcessProps): Promise<BalanceUpdateProcess> {
    return await this.model.update(props);
  }
}
