import { ModelType } from "dynamoose/dist/General";
import { Account } from "../../../domain/models/Account";
import { CreateAccountProps, IAccountRepository, UpdateBalanceProps } from "./interface";

export class AccountRepository implements IAccountRepository {
  constructor(private readonly model: ModelType<Account>) {}

  async addToBalance({ account_id, value }: UpdateBalanceProps): Promise<Account> {
    return await this.model.update({ account_id }, { $ADD: { balance: value } });
  }

  async removeFromBalance({ account_id, value }: UpdateBalanceProps): Promise<Account> {
    return await this.model.update({ account_id }, { $ADD: { balance: -value } });
  }

  async addToCreditUsed({ account_id, value }: UpdateBalanceProps): Promise<Account> {
    return await this.model.update({ account_id }, { $ADD: { credit_used: value } });
  }

  async removeFromCreditUsed({ account_id, value }: UpdateBalanceProps): Promise<Account> {
    return await this.model.update({ account_id }, { $ADD: { credit_used: -value } });
  }

  async create(props: CreateAccountProps): Promise<Account> {
    return await this.model.create({
      ...props,
      balance: 1000,
      credit_used: 0,
      credit_limit: 1000,
    });
  }

  async list(): Promise<Account[]> {
    const accounts = await this.model.scan().all().exec();

    return accounts;
  }

  async findById(id: string): Promise<Account | null> {
    return await this.model.get({ account_id: id });
  }
}
