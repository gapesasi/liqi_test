import { EventEmitter } from "events";

export abstract class BaseListener<T> {
  protected eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  abstract register(): void;
  abstract handle(data: T): Promise<void>;
}
