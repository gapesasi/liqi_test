import EventEmitter from "events";
import { mock, MockProxy } from "jest-mock-extended";
import AddValueToTargetListener from ".";
import { TransactionEvent } from "../../../domain/events/TransactionEvents";
import {
  BalanceUpdateProcess,
  BalanceUpdateProcessModel,
} from "../../../domain/models/BalanceUpdateProcess";
import { TransactionEventPayload } from "../../../domain/services/TransactionService/types";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";
import { IBalanceUpdateProcessRepository } from "../../../infra/database/balance_update_process_repository/interface";

describe("AddValueToTargetListener", () => {
  let repositoryMock: MockProxy<IAccountRepository>;
  let balanceUpdateProcessRepositoryMock: MockProxy<IBalanceUpdateProcessRepository>;
  let eventEmitter: EventEmitter;
  let listener: AddValueToTargetListener;

  const validBalanceProcess = BalanceUpdateProcessModel.Item.objectToDynamo({
    transaction_id: "tx-1234",
    added_to_target: false,
    removed_from_origin: false,
  }) as unknown as BalanceUpdateProcess;

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
    balanceUpdateProcessRepositoryMock = mock<IBalanceUpdateProcessRepository>();
    eventEmitter = new EventEmitter();
    listener = new AddValueToTargetListener(
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

  test("should call addToBalance when event is triggered", async () => {
    balanceUpdateProcessRepositoryMock.findByTransactionId.mockResolvedValue(null);

    await listener.handle(eventData);

    expect(repositoryMock.addToBalance).toHaveBeenCalledWith({
      account_id: "test-account-id",
      value: 100,
    });
  });

  test("should emit VALUE_ADDED_TO_TARGET after adding balance", async () => {
    balanceUpdateProcessRepositoryMock.findByTransactionId.mockResolvedValue(null);

    await listener.handle(eventData);

    expect(eventEmitter.emit).toHaveBeenCalledWith(TransactionEvent.VALUE_ADDED_TO_TARGET, {
      ...eventData,
      event: TransactionEvent.VALUE_ADDED_TO_TARGET,
    });
  });
});
