// import SQSClient from 'aws-sdk/clients/sqs';
// import { mock, MockProxy } from 'jest-mock-extended';
// import { MessageReceivedPayload } from '../../modules/receivedmessage/services/handleMessageCreation/types';
// import SimpleQueueService from './index';

// describe('SimpleQueueService', () => {
//   let sqsMock: MockProxy<SQSClient>;
//   let service: SimpleQueueService<MessageReceivedPayload>;

//   const validMessage: MessageReceivedPayload = {
//     idservicereport: 1,
//     id_customer: 1,
//     id_clinic: 1,
//     id_instagram_message: null,
//     id_message: null,
//     text: 'test',
//     sentbyuser: true,
//     sentbycloudia: false,
//     responsible_user: null,
//     wasunderstood: null,
//     confidence: null,
//     intent_name: null,
//     translated: null,
//     state: null,
//     from_quick_reply: null,
//     was_read_by_clinic: null,
//     origin: null,
//   };

//   beforeEach(() => {
//     sqsMock = mock<SQSClient>();
//     service = new SimpleQueueService();
//     (service as any).client = sqsMock;
//   });

//   test('getQueueArn should return queue ARN', async () => {
//     sqsMock.getQueueAttributes.mockReturnValue({
//       promise: jest.fn().mockResolvedValue({
//         Attributes: {
//           QueueArn: 'arn:aws:sqs:us-east-1:123456789012:test-queue',
//         },
//       }),
//     } as any);

//     const arn = await service.getQueueArn(
//       'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue'
//     );
//     expect(arn).toBe('arn:aws:sqs:us-east-1:123456789012:test-queue');
//   });

//   test('createQueue should create queues and return queue URL', async () => {
//     sqsMock.createQueue
//       .mockReturnValueOnce({
//         promise: jest.fn().mockResolvedValue({
//           QueueUrl:
//             'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue-dlq.fifo',
//         }),
//       } as any)
//       .mockReturnValueOnce({
//         promise: jest.fn().mockResolvedValue({
//           QueueUrl:
//             'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue.fifo',
//         }),
//       } as any);
//     sqsMock.getQueueAttributes.mockReturnValue({
//       promise: jest.fn().mockResolvedValue({
//         Attributes: {
//           QueueArn: 'arn:aws:sqs:us-east-1:123456789012:test-queue-dlq',
//         },
//       }),
//     } as any);

//     const queueUrl = await service.createQueue();
//     expect(queueUrl).toBe(
//       'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue.fifo'
//     );
//   });

//   test('enqueue should send message to SQS', async () => {
//     sqsMock.sendMessage.mockReturnValue({
//       promise: jest.fn().mockResolvedValue({}),
//     } as any);
//     await service.enqueue(validMessage);
//     expect(sqsMock.sendMessage).toHaveBeenCalled();
//   });

//   test('deleteMessage should delete message from SQS', async () => {
//     sqsMock.deleteMessage.mockReturnValue({
//       promise: jest.fn().mockResolvedValue({}),
//     } as any);
//     await service.deleteMessage('test-receipt-handle');
//     expect(sqsMock.deleteMessage).toHaveBeenCalledWith({
//       QueueUrl: expect.any(String),
//       ReceiptHandle: 'test-receipt-handle',
//     });
//   });

//   test('unqueue should receive messages from SQS', async () => {
//     sqsMock.receiveMessage.mockReturnValue({
//       promise: jest.fn().mockResolvedValue({
//         Messages: [
//           {
//             Body: JSON.stringify({ example: 'test-message' }),
//             ReceiptHandle: 'test-receipt-handle',
//           },
//         ],
//       }),
//     } as any);

//     const messages = await service.unqueue();
//     expect(messages).toEqual([
//       {
//         message: { example: 'test-message' },
//         receiptHandle: 'test-receipt-handle',
//       },
//     ]);
//   });
// });
