import { eventEmitter } from "../../domain/events/EventEmitter";
import { AccountModel } from "../../domain/models/Account";
import { BalanceUpdateProcessModel } from "../../domain/models/BalanceUpdateProcess";
import { TransactionModel } from "../../domain/models/Transaction";
import { TransactionsValidationsModel } from "../../domain/models/TransactionValidations";
import { transactionQueue } from "../../domain/services/SimpleQueueService/TransactionQueue";
import { AccountRepository } from "../../infra/database/account_repository";
import BalanceUpdateProcessRepository from "../../infra/database/balance_update_process_repository";
import TransactionRepository from "../../infra/database/transaction_repository";
import TransactionValidationsRepository from "../../infra/database/transaction_validations_repository";

import AddValueToTargetListener from "./add_value_to_target";
import BalanceAggregator from "./balance_aggregator";
import BalanceRollbackProcessorListener from "./balance_rollback_processor";
import CreateTransactionOnDbListener from "./create_transaction_on_db";
import RemoveMessageFromQueueListener from "./remove_message_from_queue";
import RemoveValueFromOriginListener from "./remove_value_from_origin";
import UpdateTransactionStatusListener from "./update_transaction_status";
import ValidateAccountListener from "./validate_account";
import ValidateTransactionListener from "./validate_transaction";
import ValidationsAggregator from "./validations_aggregator";

export default () => {
  const accountRepository = new AccountRepository(AccountModel);
  const transactionRepository = new TransactionRepository(TransactionModel);
  const transactionValidationsRepository = new TransactionValidationsRepository(
    TransactionsValidationsModel
  );
  const balanceUpdateProcessRepository = new BalanceUpdateProcessRepository(
    BalanceUpdateProcessModel
  );

  const addValueToTargetListener = new AddValueToTargetListener(accountRepository, eventEmitter);
  const balanceAggregator = new BalanceAggregator(balanceUpdateProcessRepository, eventEmitter);
  const createTransactionOnDbListener = new CreateTransactionOnDbListener(
    eventEmitter,
    transactionRepository,
    transactionValidationsRepository,
    balanceUpdateProcessRepository
  );
  const removeValueFromOriginListener = new RemoveValueFromOriginListener(
    accountRepository,
    eventEmitter
  );
  const updateTransactionStatusListener = new UpdateTransactionStatusListener(
    transactionRepository,
    eventEmitter
  );
  const validateAccountListener = new ValidateAccountListener(accountRepository, eventEmitter);
  const validateTransactionListener = new ValidateTransactionListener(
    accountRepository,
    eventEmitter
  );
  const validationsAggregator = new ValidationsAggregator(
    transactionValidationsRepository,
    eventEmitter
  );

  const balanceRollbackProcessor = new BalanceRollbackProcessorListener(
    accountRepository,
    balanceUpdateProcessRepository,
    eventEmitter
  );

  const removeMessageFromQueueListener = new RemoveMessageFromQueueListener(
    transactionQueue,
    eventEmitter
  );

  const listeners = [
    addValueToTargetListener,
    balanceAggregator,
    createTransactionOnDbListener,
    removeValueFromOriginListener,
    updateTransactionStatusListener,
    validateAccountListener,
    validateTransactionListener,
    validationsAggregator,
    balanceRollbackProcessor,
    removeMessageFromQueueListener,
  ];

  listeners.forEach((listener) => listener.register());

  console.log("Started Listeners Successfully");
};
