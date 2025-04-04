import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { ITransactionRepository } from "../../../infra/database/transaction_repository/interface";
import { BaseListener } from "../BaseListener";

export default class UpdateTransactionStatusListener extends BaseListener<TransactionEventPayload> {
  private readonly transactionRepository: ITransactionRepository;

  constructor(repository: ITransactionRepository, eventEmitter: EventEmitter) {
    super(eventEmitter);

    this.transactionRepository = repository;
  }

  register() {
    this.eventEmitter.on(TransactionEvent.ALL_VALIDATIONS_SUCCEEDED, this.handle.bind(this));
    this.eventEmitter.on(TransactionEvent.PROCESSING_SUCEEDED, this.handle.bind(this));
    this.eventEmitter.on(TransactionEvent.TRANSACTION_FAILED, this.handle.bind(this));
  }

  async handle(data: TransactionEventPayload) {
    console.info("Listener - Update Transaction Status - Started");

    const { event } = data;

    switch (event) {
      case TransactionEvent.ALL_VALIDATIONS_SUCCEEDED:
        await this.transactionRepository.updateStatus({
          transaction_id: data.transaction_id,
          status: "processing",
        });
        break;
      case TransactionEvent.PROCESSING_SUCEEDED:
        await this.transactionRepository.updateStatus({
          transaction_id: data.transaction_id,
          status: "completed",
        });

        this.eventEmitter.emit(TransactionEvent.TRANSACTION_COMPLETED, {
          ...data,
          event: TransactionEvent.TRANSACTION_COMPLETED,
        });

        break;
      case TransactionEvent.TRANSACTION_FAILED:
        await this.transactionRepository.updateStatus({
          transaction_id: data.transaction_id,
          status: "failed",
        });
        break;
    }

    console.info("Listener - Update Transaction Status - Finished");
  }
}
