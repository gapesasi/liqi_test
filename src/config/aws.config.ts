import dotenv from "dotenv";
dotenv.config();

export const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: "us-east-1",
    dynamoUrl: "http://localhost:8000",
    awsUrl: process.env.SQS_URL || "",
    sqsQueueUrl: process.env.SQS_QUEUE_URL || "",
} 