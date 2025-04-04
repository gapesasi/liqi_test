import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";
import { BaseListener } from "../BaseListener";
import loggerMiddleware from "../loggerMiddleware";

export default class BalanceRollbackProcessorListener extends BaseListener<TransactionEventPayload> {
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

  register(): void {
    this.eventEmitter.on(
      TransactionEvent.ROLLBACK_BALANCE,
      loggerMiddleware(TransactionEvent.ROLLBACK_BALANCE, this.handle.bind(this))
    );
  }

  async handle(data: TransactionEventPayload): Promise<void> {
    const aggregator = await this.balanceUpdateProcessRepository.findByTransactionId(
      data.transaction_id
    );

    if (!aggregator) {
      return;
    }

    const { added_to_target, removed_from_origin } = aggregator;

    if (added_to_target) {
      await this.accountRepository.removeFromBalance({
        account_id: data.target,
        value: data.value,
      });
    }

    if (removed_from_origin) {
      switch (data.type) {
        case "debit":
          await this.accountRepository.addToBalance({
            account_id: data.origin,
            value: data.value,
          });
          break;
        case "credit":
          await this.accountRepository.removeFromCreditUsed({
            account_id: data.origin,
            value: data.value,
          });
          break;
      }
    }
  }
}
