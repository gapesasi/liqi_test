import EventEmitter from "events";
import { mock, MockProxy } from "jest-mock-extended";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import AddValueToTargetListener from ".";

describe("AddValueToTargetListener", () => {
  let repositoryMock: MockProxy<IAccountRepository>;
  let eventEmitter: EventEmitter;
  let listener: AddValueToTargetListener;

  const eventData: TransactionEventPayload = {
    value: 100,
    target: "test-account-id",
    origin: "some-origin-id",
    type: "credit",
    transaction_id: "tx-1234",
    timestamp: new Date().getTime(),
    status: "pending",
    messageReceiptHandle: "receipt-1234",
    event: TransactionEvent.ALL_VALIDATIONS_SUCCEEDED,
  };

  beforeEach(() => {
    repositoryMock = mock<IAccountRepository>();
    eventEmitter = new EventEmitter();
    listener = new AddValueToTargetListener(repositoryMock, eventEmitter);

    jest.spyOn(eventEmitter, "on");
    jest.spyOn(eventEmitter, "emit");
    listener.register();
  });

  test("should register the event listener", () => {
    expect(eventEmitter.on).toHaveBeenCalledWith(
      TransactionEvent.ALL_VALIDATIONS_SUCCEEDED,
      expect.any(Function)
    );
  });

  test("should call addToBalance when event is triggered", async () => {
    eventEmitter.emit(TransactionEvent.ALL_VALIDATIONS_SUCCEEDED, eventData);

    expect(repositoryMock.addToBalance).toHaveBeenCalledWith({
      account_id: "test-account-id",
      value: 100,
    });
  });

  test("should emit VALUE_ADDED_TO_TARGET after adding balance", async () => {
    eventEmitter.emit(TransactionEvent.ALL_VALIDATIONS_SUCCEEDED, eventData);

    expect(eventEmitter.emit).toHaveBeenCalledWith(TransactionEvent.VALUE_ADDED_TO_TARGET, {
      ...eventData,
      event: TransactionEvent.VALUE_ADDED_TO_TARGET,
    });
  });
});
