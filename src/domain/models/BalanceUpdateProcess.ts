import dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";

export class BalanceUpdateProcess extends Item {
  transaction_id: string;
  removed_from_origin: boolean;
  added_to_target: boolean;
}

const balanceUpdateProcessSchema = new dynamoose.Schema({
  transaction_id: { type: String, hashKey: true },
  removed_from_origin: { type: Boolean },
  added_to_target: { type: Boolean },
});

export const BalanceUpdateProcessModel = dynamoose.model<BalanceUpdateProcess>(
  "BalanceUpdateProcess",
  balanceUpdateProcessSchema
);
