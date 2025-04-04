import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import { BaseListener } from "../BaseListener";
import listenerErrorHandler from "../errorHandler";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";
import logger from "../../../utils/logger";

export default class RemoveValueFromOrigin extends BaseListener<TransactionEventPayload> {
  private readonly accountRepository: IAccountRepository;
  private readonly balanceUpdateProcessRepository: IBalanceUpdateProcessRepository;

  constructor(
    repository: IAccountRepository,
    balanceUpdateProcessRepository: IBalanceUpdateProcessRepository,
    eventEmitter: EventEmitter
  ) {
    super(eventEmitter);

    this.balanceUpdateProcessRepository = balanceUpdateProcessRepository;
    this.accountRepository = repository;
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
    logger.info(`Listener - ${data.transaction_id} - Remove Value From Origin - Started`);

    const { value, origin, type } = data;

    const balanceUpdateProcess = await this.balanceUpdateProcessRepository.findByTransactionId(
      data.transaction_id
    );

    if (balanceUpdateProcess) {
      if (balanceUpdateProcess.removed_from_origin) {
        logger.warn(
          `Listener - ${data.transaction_id} - Remove Value From Origin - Process already done, returning`
        );
        return;
      }
    }

    switch (type) {
      case "debit":
        await this.accountRepository.removeFromBalance({
          account_id: origin,
          value,
        });
        break;
      case "credit":
        await this.accountRepository.addToCreditUsed({
          account_id: origin,
          value,
        });
        break;
    }

    this.eventEmitter.emit(TransactionEvent.VALUE_REMOVED_FROM_ORIGIN, {
      ...data,
      event: TransactionEvent.VALUE_REMOVED_FROM_ORIGIN,
    });

    logger.info(`Listener - ${data.transaction_id} - Remove Value From Origin - Finshed`);
  }
}
