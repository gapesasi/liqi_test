import dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";
import { v4 as uuidv4 } from "uuid";

export class Account extends Item {
  account_id: string;
  name: string;
  email: string;
  balance: number;
  credit_used: number;
  credit_limit: number;
}

const accountSchema = new dynamoose.Schema({
  account_id: { type: String, hashKey: true, default: uuidv4 },
  name: { type: String },
  email: { type: String },
  balance: { type: Number },
  credit_used: { type: Number },
  credit_limit: { type: Number },
});

export const AccountModel = dynamoose.model<Account>("Account", accountSchema);
