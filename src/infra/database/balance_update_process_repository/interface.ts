import { BalanceUpdateProcess } from "../../../domain/models/BalanceUpdateProcess";

export type CreateBalanceUpdateProcessProps = {
  transaction_id: string;
  added_to_target: boolean;
  removed_from_origin: boolean;
};

export type UpdateBalanceUpdateProcessProps = {
  transaction_id: string;
  added_to_target?: boolean;
  removed_from_origin?: boolean;
};

export interface IBalanceUpdateProcessRepository {
  create(props: CreateBalanceUpdateProcessProps): Promise<BalanceUpdateProcess>;
  findByTransactionId(transaction_id: string): Promise<BalanceUpdateProcess | null>;
  update(props: UpdateBalanceUpdateProcessProps): Promise<BalanceUpdateProcess>;
}
