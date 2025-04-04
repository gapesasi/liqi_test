import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import { BaseListener } from "../BaseListener";
import listenerErrorHandler from "../errorHandler";

export default class AddValueToTargetListener extends BaseListener<TransactionEventPayload> {
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
    console.info("Listener - Add Value To Target - Started");

    const { value, target } = data;

    this.accountRepository.addToBalance({
      account_id: target,
      value,
    });

    this.eventEmitter.emit(TransactionEvent.VALUE_ADDED_TO_TARGET, {
      ...data,
      event: TransactionEvent.VALUE_ADDED_TO_TARGET,
    });

    console.info("Listener - Add Value To Target - Finished");
  }
}
