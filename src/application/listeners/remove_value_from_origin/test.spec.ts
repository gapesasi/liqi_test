import EventEmitter from "events";
import { mock, MockProxy } from "jest-mock-extended";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import RemoveValueFromOrigin from ".";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";

describe("RemoveValueFromOrigin", () => {
  let repositoryMock: MockProxy<IAccountRepository>;
  let balanceUpdateProcessRepositoryMock: MockProxy<IBalanceUpdateProcessRepository>;

  let eventEmitter: EventEmitter;
  let listener: RemoveValueFromOrigin;
  const eventData: TransactionEventPayload = {
    value: 200,
    target: "target-2",
    origin: "origin-2",
    type: "debit",
    transaction_id: "tx-202",
    timestamp: Date.now(),
    status: "pending",
    messageReceiptHandle: "receipt-202",
    event: TransactionEvent.ALL_VALIDATIONS_SUCCEEDED,
  };

  beforeEach(() => {
    repositoryMock = mock<IAccountRepository>();
    balanceUpdateProcessRepositoryMock = mock<IBalanceUpdateProcessRepository>();
    eventEmitter = new EventEmitter();
    listener = new RemoveValueFromOrigin(
      repositoryMock,
      balanceUpdateProcessRepositoryMock,
      eventEmitter
    );
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

  test("should call removeFromBalance for debit", async () => {
    await listener.handle({ ...eventData, type: "debit" });
    expect(repositoryMock.removeFromBalance).toHaveBeenCalledWith({
      account_id: eventData.origin,
      value: eventData.value,
    });
    expect(eventEmitter.emit).toHaveBeenCalledWith(TransactionEvent.VALUE_REMOVED_FROM_ORIGIN, {
      ...eventData,
      event: TransactionEvent.VALUE_REMOVED_FROM_ORIGIN,
    });
  });

  test("should call addToCreditUsed for credit", async () => {
    await listener.handle({ ...eventData, type: "credit" });
    expect(repositoryMock.addToCreditUsed).toHaveBeenCalledWith({
      account_id: eventData.origin,
      value: eventData.value,
    });
    expect(eventEmitter.emit).toHaveBeenCalledWith(TransactionEvent.VALUE_REMOVED_FROM_ORIGIN, {
      ...eventData,
      type: "credit",
      event: TransactionEvent.VALUE_REMOVED_FROM_ORIGIN,
    });
  });
});
