import { TransactionEvent } from "../../events/TransactionEvents";

export type TransactionPayload = {
  transaction_id: string;
  value: number;
  type: "debit" | "credit";
  origin: string;
  target: string;
};

export type TransactionEventPayload = TransactionPayload & {
  timestamp: number;
  status: "pending" | "processing" | "completed" | "failed";
  messageReceiptHandle: string;
  event: TransactionEvent;
};
