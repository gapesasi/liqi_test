import EventEmitter from "events";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { BaseListener } from "../BaseListener";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import listenerErrorHandler from "../errorHandler";
import logger from "../../../utils/logger";

export default class ValidateAccountListener extends BaseListener<TransactionEventPayload> {
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
    logger.info(`Listener - ${data.transaction_id} - Validate Account - Started`);

    const originAccount = await this.accountRepository.findById(data.origin);

    if (!originAccount) {
      throw new Error("Origin Account Not Found");
    }

    const targetAccount = await this.accountRepository.findById(data.target);
    if (!targetAccount) {
      throw new Error("Target Account Not Found");
    }

    this.eventEmitter.emit(TransactionEvent.ACCOUNT_VALIDATION_SUCCEEDED, {
      ...data,
      event: TransactionEvent.ACCOUNT_VALIDATION_SUCCEEDED,
    });

    logger.info(`Listener - ${data.transaction_id} - Validate Account - Finished`);
  }
}
