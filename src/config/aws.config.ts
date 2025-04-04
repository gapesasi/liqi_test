import dotenv from "dotenv";
dotenv.config();

export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
  region: "us-east-1",
  dynamoUrl: process.env.DATABASE_URL ?? "http://database:8000",
  awsUrl: process.env.SQS_URL ?? "http://localstack:4566",
  sqsQueueUrl: process.env.SQS_QUEUE_URL ?? "",
};
