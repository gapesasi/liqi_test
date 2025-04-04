import dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";
import { v4 as uuidv4 } from "uuid";

export class Transaction extends Item {
  transaction_id: string;
  value: number;
  type: "debit" | "credit";
  origin: string;
  target: string;
  timestamp: Date;
  status: "pending" | "processing" | "completed" | "failed";
}

const transactionSchema = new dynamoose.Schema({
  transaction_id: { type: String, hashKey: true, default: uuidv4 },
  value: { type: Number },
  type: { type: String, enum: ["debit", "credit"] },
  origin: { type: String },
  target: { type: String },
  timestamp: { type: Date },
  status: { type: String, enum: ["pending", "processing", "completed", "failed"] },
});

export const TransactionModel = dynamoose.model<Transaction>("Transaction", transactionSchema);

/**
 * @swagger
 * definitions:
 *   Transaction:
 *    properties:
 *      transaction_id:
 *        type: string
 *      value:
 *        type: numbers
 *        format: float
 *      type:
 *        type: string
 *        enum: [
 *          debit,
 *          credit,
 *        ]
 *      origin:
 *        type: string
 *      target:
 *        type: string
 *      timestamp:
 *        type: string
 */
