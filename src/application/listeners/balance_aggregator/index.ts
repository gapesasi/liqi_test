import EventEmitter from "events";
import { eventEmitter } from "../../../domain/events/EventEmitter";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { BaseListener } from "../BaseListener";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";

export default class BalanceAggregator extends BaseListener<TransactionEventPayload> {
  private readonly balanceUpdateProcessRepository: IBalanceUpdateProcessRepository;

  constructor(repository: IBalanceUpdateProcessRepository, eventEmitter: EventEmitter) {
    super(eventEmitter);

    this.balanceUpdateProcessRepository = repository;
  }

  register() {
    this.eventEmitter.on(TransactionEvent.VALUE_ADDED_TO_TARGET, this.handle.bind(this));
    this.eventEmitter.on(TransactionEvent.VALUE_REMOVED_FROM_ORIGIN, this.handle.bind(this));
  }

  async handle(data: TransactionEventPayload) {
    const aggregator = await this.balanceUpdateProcessRepository.findByTransactionId(
      data.transaction_id
    );

    if (!aggregator) {
      await this.balanceUpdateProcessRepository.create({
        transaction_id: data.transaction_id,
        added_to_target: false,
        removed_from_origin: false,
      });
    }

    switch (data.event) {
      case TransactionEvent.VALUE_ADDED_TO_TARGET:
        await this.balanceUpdateProcessRepository.update({
          transaction_id: data.transaction_id,
          added_to_target: true,
        });
        break;
      case TransactionEvent.VALUE_REMOVED_FROM_ORIGIN:
        await this.balanceUpdateProcessRepository.update({
          transaction_id: data.transaction_id,
          removed_from_origin: true,
        });
        break;
    }

    const updatedProcess = await this.balanceUpdateProcessRepository.findByTransactionId(
      data.transaction_id
    );

    const { added_to_target, removed_from_origin } = updatedProcess;

    if (added_to_target && removed_from_origin) {
      eventEmitter.emit(TransactionEvent.PROCESSING_SUCEEDED, {
        ...data,
        event: TransactionEvent.PROCESSING_SUCEEDED,
      });

      console.info("Listener - Balance Aggregator - Finished");
    }
  }
}
