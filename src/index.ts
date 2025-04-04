import express from "express";
import { createServer } from "http";
import * as router from "./presentation/routes";
import { startDynamoose } from "./config/database";
import transactionQueueConsumer from "./domain/services/TransactionService/consumer";
import startListeners from "./application/listeners";
import logger from "./utils/logger";

const PORT = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);

app.use(express.json());

startDynamoose();
startListeners();

Object.values(router).forEach((route) => app.use(route));

transactionQueueConsumer();

server.listen(PORT, () => {
  logger.info(`🚀 App is running on port ${PORT}`);
});
