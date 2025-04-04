import logger from "../../utils/logger";

export default function loggerMiddleware(eventName: string, handler: (data: any) => Promise<void>) {
  return async (data: any) => {
    logger.info(`Listener ${data.transaction_id} - ${eventName} - Started`);
    await handler(data);
    logger.info(`Listener ${data.transaction_id} - ${eventName} - Finished`);
  };
}
