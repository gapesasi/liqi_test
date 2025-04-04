import {
    SQSClient,
    GetQueueAttributesCommand,
    CreateQueueCommand,
    SendMessageCommand,
    DeleteMessageCommand,
    ReceiveMessageCommand,
  } from "@aws-sdk/client-sqs";
  import { mockClient } from "aws-sdk-client-mock";
  import { TransactionPayload } from "../TransactionService/types";
  import SimpleQueueService from "./index";
  
  describe("SimpleQueueService", () => {
    let sqsMock: ReturnType<typeof mockClient>;
    let service: SimpleQueueService<TransactionPayload>;
  
    const validMessage: TransactionPayload = {
      origin: "test_origin",
      target: "test_target",
      value: 100,
      type: "debit",
      transaction_id: "1234",
    };
  
    beforeEach(() => {
      sqsMock = mockClient(SQSClient);
      service = new SimpleQueueService();
      (service as any).client = new SQSClient({}); 
      sqsMock.reset();
    });
  
    test("getQueueArn should return queue ARN", async () => {
      sqsMock.on(GetQueueAttributesCommand).resolves({
        Attributes: { QueueArn: "arn:aws:sqs:us-east-1:123456789012:test-queue" },
      });
  
      const arn = await service.getQueueArn(
        "https://sqs.us-east-1.amazonaws.com/123456789012/test-queue"
      );
  
      expect(arn).toBe("arn:aws:sqs:us-east-1:123456789012:test-queue");
    });
  
    test("createQueue should create queues and return queue URL", async () => {
      sqsMock.on(CreateQueueCommand, { QueueName: "transaction-dlq-queue.fifo" }).resolves({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/test-queue-dlq.fifo",
      });
      sqsMock.on(GetQueueAttributesCommand).resolves({
        Attributes: { QueueArn: "arn:aws:sqs:us-east-1:123456789012:test-queue-dlq" },
      });
      sqsMock.on(CreateQueueCommand, { QueueName: "transaction-queue.fifo" }).resolves({
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/test-queue.fifo",
      });
  
      const queueUrl = await service.createQueue();
      expect(queueUrl).toBe("https://sqs.us-east-1.amazonaws.com/123456789012/test-queue.fifo");
    });
  
    test("enqueue should send message to SQS", async () => {
      sqsMock.on(SendMessageCommand).resolves({});
      await service.enqueue(validMessage);
      expect(sqsMock.commandCalls(SendMessageCommand).length).toBeGreaterThan(0);
    });
  
    test("deleteMessage should delete message from SQS", async () => {
      sqsMock.on(DeleteMessageCommand).resolves({});
      await service.deleteMessage("test-receipt-handle");
      expect(sqsMock.commandCalls(DeleteMessageCommand).length).toBeGreaterThan(0);
    });
  
    test("unqueue should receive messages from SQS", async () => {
      sqsMock.on(ReceiveMessageCommand).resolves({
        Messages: [
          {
            Body: JSON.stringify({ example: "test-message" }),
            ReceiptHandle: "test-receipt-handle",
          },
        ],
      });
  
      const messages = await service.unqueue();
      expect(messages).toEqual([
        {
          message: { example: "test-message" },
          receiptHandle: "test-receipt-handle",
        },
      ]);
    });
  });
  