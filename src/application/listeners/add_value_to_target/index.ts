import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import { BaseListener } from "../BaseListener";
import listenerErrorHandler from "../errorHandler";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";
import logger from "../../../utils/logger";

export default class AddValueToTargetListener extends BaseListener<TransactionEventPayload> {
  private readonly accountRepository: IAccountRepository;
  private readonly balanceUpdateProcessRepository: IBalanceUpdateProcessRepository;

  constructor(
    repository: IAccountRepository,
    balanceUpdateProcessRepository: IBalanceUpdateProcessRepository,
    eventEmitter: EventEmitter
  ) {
    super(eventEmitter);

    this.accountRepository = repository;
    this.balanceUpdateProcessRepository = balanceUpdateProcessRepository;
  }

  register() {
    this.eventEmitter.on(
      TransactionEvent.ALL_VALIDATIONS_SUCCEEDED,
      listenerErrorHandler(
        this.eventEmitter,
        TransactionEvent.ALL_VALIDATIONS_SUCCEEDED,
        this.handle.bind(this)
      )
    );
  }

  async handle(data: TransactionEventPayload) {
    logger.info(`Listener - ${data.transaction_id} - Add Value To Target - Started`);

    const { value, target } = data;

    const balanceUpdateProcess = await this.balanceUpdateProcessRepository.findByTransactionId(
      data.transaction_id
    );

    if (balanceUpdateProcess) {
      if (balanceUpdateProcess.added_to_target) {
        logger.warn(
          `Listener - ${data.transaction_id} - Add Value To Target - Process already done, returning`
        );
        return;
      }
    }

    await this.accountRepository.addToBalance({
      account_id: target,
      value,
    });

    this.eventEmitter.emit(TransactionEvent.VALUE_ADDED_TO_TARGET, {
      ...data,
      event: TransactionEvent.VALUE_ADDED_TO_TARGET,
    });

    logger.info(`Listener - ${data.transaction_id} - Add Value To Target - Finished`);
  }
}
