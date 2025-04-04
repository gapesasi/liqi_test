import EventEmitter from "events";
import { TransactionEvent } from "../../domain/events/TransactionEvents";
import logger from "../../utils/logger";
import loggerMiddleware from "./loggerMiddleware";

export default function listenerErrorHandler(
  eventEmitter: EventEmitter,
  eventName: string,
  handler: (data: any) => Promise<void>
) {
  return async (data: any) => {
    try {
      const middleware = loggerMiddleware(eventName, handler);
      await middleware(data);
    } catch (error: any) {
      logger.error(`Error in listener for ${eventName}:`, error);

      if (eventName === TransactionEvent.ALL_VALIDATIONS_SUCCEEDED) {
        eventEmitter.emit(TransactionEvent.ROLLBACK_BALANCE, {
          ...data,
          event: TransactionEvent.ROLLBACK_BALANCE,
        });
      }

      eventEmitter.emit(TransactionEvent.TRANSACTION_FAILED, {
        ...data,
        event: TransactionEvent.TRANSACTION_FAILED,
        error: error.message ?? "",
      });
    }
  };
}
