import EventEmitter from "events";
import { eventEmitter } from "../../../domain/events/EventEmitter";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";
import { ITransactionRepository } from "../../../infra/database/transaction_repository/interface";
import { ITransactionValidationsRepository } from "../../../infra/database/transaction_validations_repository/interface";
import { BaseListener } from "../BaseListener";
import listenerErrorHandler from "../errorHandler";
import logger from "../../../utils/logger";

export default class CreateTransactionOnDbListener extends BaseListener<TransactionEventPayload> {
  constructor(
    eventEmitter: EventEmitter,
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionValidationsRepository: ITransactionValidationsRepository,
    private readonly balanceUpdateProcessRepository: IBalanceUpdateProcessRepository
  ) {
    super(eventEmitter);
  }

  register() {
    this.eventEmitter.on(
      TransactionEvent.PROCESSING_STARTED,
      listenerErrorHandler(
        this.eventEmitter,
        TransactionEvent.PROCESSING_STARTED,
        this.handle.bind(this)
      )
    );
  }

  async handle(data: TransactionEventPayload) {
    logger.info(`Listener - ${data.transaction_id} - Transaction Creation On DB - Started`);

    const transaction = await this.transactionRepository.create({
      origin: data.origin,
      target: data.target,
      value: data.value,
      type: data.type,
      timestamp: data.timestamp,
      status: data.status,
    });

    const validationsPromise = this.transactionValidationsRepository.create({
      transaction_id: transaction.transaction_id,
      accounts_valid: false,
      balance_valid: false,
      finished: false,
    });

    const BalanceUpdateProcessPromise = this.balanceUpdateProcessRepository.create({
      transaction_id: transaction.transaction_id,
      added_to_target: false,
      removed_from_origin: false,
    });

    await Promise.all([validationsPromise, BalanceUpdateProcessPromise]);

    const payload: TransactionEventPayload = {
      ...transaction,
      messageReceiptHandle: data.messageReceiptHandle,
      event: TransactionEvent.TRANSACTION_CREATION_SUCEEDED,
    };

    eventEmitter.emit(TransactionEvent.TRANSACTION_CREATION_SUCEEDED, payload);

    logger.info(`Listener - ${data.transaction_id} - Transaction Creation On DB - Finished`);
  }
}
