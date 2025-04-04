import { eventEmitter } from "../../events/EventEmitter";
import { TransactionEvent, TransactionEventData } from "../../events/TransactionEvents";
import { transactionQueue } from "../SimpleQueueService/TransactionQueue";
import { TransactionEventPayload } from "./types";

const transactionQueueConsumer = async () => {
  await transactionQueue.createQueue();

  const poll = async () => {
    while (true) {
      try {
        const transactions = await transactionQueue.unqueue();

        console.log("Transactions Found: ", transactions);

        if (transactions.length > 0) {
          transactions.forEach((transaction) => {
            const transacionEvent: TransactionEventData<TransactionEventPayload> = {
              event: TransactionEvent.PROCESSING_STARTED,
              data: {
                ...transaction.message,
                timestamp: new Date().getTime(),
                status: "pending",
                messageReceiptHandle: transaction.receiptHandle,
                event: TransactionEvent.PROCESSING_STARTED,
              },
            };

            eventEmitter.emit(transacionEvent.event, transacionEvent.data);
          });
        }
      } catch (error) {
        console.error(error);
      }

      await new Promise<void>((res) => {
        setTimeout(res, 50);
      });
    }
  };

  await poll();
};

export default transactionQueueConsumer;
