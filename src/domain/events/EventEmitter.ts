import { EventEmitter } from 'events';

class TransactionEventEmitter extends EventEmitter {}

export const eventEmitter = new TransactionEventEmitter();