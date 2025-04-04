import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import { BaseListener } from "../BaseListener";
import listenerErrorHandler from "../errorHandler";

export default class RemoveValueFromOrigin extends BaseListener<TransactionEventPayload> {
  private readonly accountRepository: IAccountRepository;

  constructor(repository: IAccountRepository, eventEmitter: EventEmitter) {
    super(eventEmitter);

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
    const { value, origin, type } = data;

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
  }
}
