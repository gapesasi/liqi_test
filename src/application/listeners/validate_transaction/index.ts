import EventEmitter from "events";
import { BaseListener } from "../BaseListener";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import listenerErrorHandler from "../errorHandler";

export default class ValidateTransactionListener extends BaseListener<TransactionEventPayload> {
  private readonly accountRepository: IAccountRepository;

  constructor(repository: IAccountRepository, eventEmitter: EventEmitter) {
    super(eventEmitter);

    this.accountRepository = repository;
  }

  register() {
    this.eventEmitter.on(
      TransactionEvent.TRANSACTION_CREATION_SUCEEDED,
      listenerErrorHandler(
        this.eventEmitter,
        TransactionEvent.TRANSACTION_CREATION_SUCEEDED,
        this.handle.bind(this)
      )
    );
  }

  async handle(data: TransactionEventPayload) {
    const originAccount = await this.accountRepository.findById(data.origin);

    if (!originAccount) {
      throw new Error("Origin Account Not Found");
    }

    const isBalanceValid = (balance: number) => balance >= data.value;

    switch (data.type) {
      case "debit":
        if (!isBalanceValid(originAccount.balance)) {
          throw new Error("Origin Account Balance Not Enough");
        }
        break;
      case "credit":
        const balance = originAccount.credit_limit - originAccount.credit_used;
        if (!isBalanceValid(balance)) {
          throw new Error("Target Account Credit Limit Not Enough");
        }
        break;
    }

    this.eventEmitter.emit(TransactionEvent.BALANCE_VALIDATION_SUCCEEDED, {
      ...data,
      event: TransactionEvent.BALANCE_VALIDATION_SUCCEEDED,
    });
  }
}
