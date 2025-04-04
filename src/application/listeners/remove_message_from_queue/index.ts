import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import SimpleQueueService from "../../../domain/services/SimpleQueueService";
import {
  TransactionEventPayload,
  TransactionPayload,
} from "../../../domain/services/TransactionService/types";
import { BaseListener } from "../BaseListener";

export default class RemoveMessageFromQueueListener extends BaseListener<TransactionEventPayload> {
  private readonly transactionQueue: SimpleQueueService<TransactionPayload>;

  constructor(queue: SimpleQueueService<TransactionPayload>, eventEmitter: EventEmitter) {
    super(eventEmitter);

    this.transactionQueue = queue;
  }

  register() {
    this.eventEmitter.on(TransactionEvent.TRANSACTION_COMPLETED, this.handle.bind(this));
  }

  async handle(data: TransactionEventPayload) {
    console.info("Listener - Remove Message From Queue - Started");

    const { messageReceiptHandle } = data;

    await this.transactionQueue.deleteMessage(messageReceiptHandle);

    console.info("Listener - Remove Message From Queue - Finished");
  }
}
