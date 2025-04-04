import {
  CreateQueueCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { awsConfig } from "../../../config/aws.config";

export default class SimpleQueueService<T> {
  private readonly client: SQSClient;
  private readonly awsUrl: string;
  private queueUrl: string;

  constructor() {
    this.awsUrl = awsConfig.awsUrl;
    this.queueUrl = awsConfig.sqsQueueUrl;
    this.client = new SQSClient({
      region: awsConfig.region,
      endpoint: this.awsUrl,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async getQueueArn(queueUrl: string): Promise<string> {
    try {
      const command = new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ["QueueArn"],
      });

      const data = await this.client.send(command);
      return data.Attributes?.QueueArn || "";
    } catch (error) {
      //   Logger.error('SimpleQueueService.ts', 'Error Get Attributes', error);
      throw error;
    }
  }

  async createQueue(): Promise<string> {
    try {
      const dlqCommand = new CreateQueueCommand({
        QueueName: "test-queue-dlq.fifo",
        Attributes: {
          VisibilityTimeout: "10",
          MessageRetentionPeriod: "86400",
          FifoQueue: "true",
          ContentBasedDeduplication: "true",
        },
      });

      const dlqData = await this.client.send(dlqCommand);

      const dlqArn = await this.getQueueArn(dlqData.QueueUrl || "");

      const queueCommand = new CreateQueueCommand({
        QueueName: "test-queue.fifo",
        Attributes: {
          VisibilityTimeout: "10",
          FifoQueue: "true",
          ContentBasedDeduplication: "true",
          RedrivePolicy: JSON.stringify({
            deadLetterTargetArn: dlqArn,
            maxReceiveCount: "3",
          }),
        },
      });

      const queueData = await this.client.send(queueCommand);
      this.queueUrl = queueData.QueueUrl || "";
      return this.queueUrl;
    } catch (error) {
      //   Logger.error('SimpleQueueService.ts', 'Error Create Queue', error);
      throw error;
    }
  }

  async enqueue(message: T): Promise<void> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
        MessageGroupId: "received-messages",
      });

      const result = await this.client.send(command);
      return;
    } catch (error) {
      //   Logger.error('SimpleQueueService.ts', 'Error Enqueue Message', error);
      throw error;
    }
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.client.send(command);
    } catch (error) {
      //   Logger.error('SimpleQueueService.ts', 'Error Delete Message', error);
      throw error;
    }
  }

  async unqueue(): Promise<{ message: T; receiptHandle: string }[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 10,
        WaitTimeSeconds: 20,
      });

      const newData = await this.client.send(command);

      return (newData.Messages || []).map((msg) => ({
        message: JSON.parse(msg.Body || "{}") as T,
        receiptHandle: msg.ReceiptHandle || "",
      }));
    } catch (error) {
      //   Logger.error('SimpleQueueService.ts', 'Error Unqueue Message', error);
      throw error;
    }
  }
}
