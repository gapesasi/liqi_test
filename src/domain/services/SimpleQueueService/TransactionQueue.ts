import SimpleQueueService from ".";
import { TransactionPayload } from "../TransactionService/types";

export const transactionQueue = new SimpleQueueService<TransactionPayload>();
