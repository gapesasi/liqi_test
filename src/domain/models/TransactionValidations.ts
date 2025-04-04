import dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";
import { finished } from "stream";

export class TransactionValidations extends Item {
  transaction_id: string;
  accounts_valid: boolean;
  balance_valid: boolean;
  finished: boolean;
}

const transactionValidationsSchema = new dynamoose.Schema({
  transaction_id: { type: String, hashKey: true },
  accounts_valid: { type: Boolean },
  balance_valid: { type: Boolean },
  finished: { type: Boolean },
});

export const TransactionsValidationsModel = dynamoose.model<TransactionValidations>(
  "TransactionValidations",
  transactionValidationsSchema
);
