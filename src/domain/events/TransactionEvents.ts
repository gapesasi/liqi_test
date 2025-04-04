export enum TransactionEvent {
  PROCESSING_STARTED = "processing_started",
  TRANSACTION_CREATION_SUCEEDED = "transaction_creation_succeeded",
  ACCOUNT_VALIDATION_SUCCEEDED = "account_validation_succeeded",
  BALANCE_VALIDATION_SUCCEEDED = "balance_validation_succeeded",
  ALL_VALIDATIONS_SUCCEEDED = "all_validations_succeeded",
  VALIDATION_FAILED = "validation_failed",

  VALUE_REMOVED_FROM_ORIGIN = "value_removed_from_origin",
  VALUE_ADDED_TO_TARGET = "value_added_to_target",
  ROLLBACK_BALANCE = "rollback_balance",

  PROCESSING_SUCEEDED = "processing_succeeded",
  TRANSACTION_FAILED = "transaction_failed",

  TRANSACTION_COMPLETED = "transaction_completed",
}

export interface TransactionEventData<T> {
  event: TransactionEvent;
  data: T;
}
