import { Account } from "../../../domain/models/Account";

export type CreateAccountProps = {
  name: string;
  email: string;
};

export type UpdateBalanceProps = {
  account_id: string;
  value: number;
}

export interface IAccountRepository {
  create(props: CreateAccountProps): Promise<Account>;
  list(): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  addToBalance(props: UpdateBalanceProps): Promise<Account>;
  removeFromBalance(props: UpdateBalanceProps): Promise<Account>;
  addToCreditUsed(props: UpdateBalanceProps): Promise<Account>;
  removeFromCreditUsed(props: UpdateBalanceProps): Promise<Account>;
}
