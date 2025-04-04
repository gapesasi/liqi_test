import { TransactionValidations } from "../../../domain/models/TransactionValidations";

export type CreateTransactionValidationsProps = {
  transaction_id: string;
  accounts_valid: boolean;
  balance_valid: boolean;
  finished: boolean;
};

export type UpdateTransactionValidationsProps = {
  transaction_id: string;
  accounts_valid?: boolean;
  balance_valid?: boolean;
  finished?: boolean;
};

export interface ITransactionValidationsRepository {
  create(props: CreateTransactionValidationsProps): Promise<TransactionValidations>;
  findByTransactionId(transaction_id: string): Promise<TransactionValidations | null>;
  update(props: UpdateTransactionValidationsProps): Promise<TransactionValidations>;
}
