import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { ITransactionValidationsRepository } from "../../../infra/database/transaction_validations_repository/interface";
import { BaseListener } from "../BaseListener";

export default class ValidationsAggregator extends BaseListener<TransactionEventPayload> {
  private readonly validationsRepository: ITransactionValidationsRepository;

  constructor(repository: ITransactionValidationsRepository, eventEmitter: EventEmitter) {
    super(eventEmitter);

    this.validationsRepository = repository;
  }

  register() {
    this.eventEmitter.on(TransactionEvent.ACCOUNT_VALIDATION_SUCCEEDED, this.handle.bind(this));
    this.eventEmitter.on(TransactionEvent.BALANCE_VALIDATION_SUCCEEDED, this.handle.bind(this));
  }

  async handle(event: TransactionEventPayload) {
    switch (event.event) {
      case TransactionEvent.ACCOUNT_VALIDATION_SUCCEEDED:
        await this.validationsRepository.update({
          transaction_id: event.transaction_id,
          accounts_valid: true,
        });
        break;
      case TransactionEvent.BALANCE_VALIDATION_SUCCEEDED:
        await this.validationsRepository.update({
          transaction_id: event.transaction_id,
          balance_valid: true,
        });
        break;
    }

    const aggregator = await this.validationsRepository.findByTransactionId(event.transaction_id);

    const { accounts_valid, balance_valid, finished } = aggregator;

    console.log({ aggregator });

    if (accounts_valid && balance_valid && !finished) {
      this.eventEmitter.emit(TransactionEvent.ALL_VALIDATIONS_SUCCEEDED, {
        ...event,
        event: TransactionEvent.ALL_VALIDATIONS_SUCCEEDED,
      });

      this.validationsRepository.update({
        transaction_id: event.transaction_id,
        finished: true,
      });

      console.info("Listener - Validations Aggregator - Finished");
    }
  }
}
