import dynamoose from "dynamoose";

export const startDynamoose = () => {
  const config = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    region: "us-east-1",
    // endpoint: "http://host.docker.internal:8000"
    endpoint: "http://localhost:8000",
  });

  dynamoose.aws.ddb.set(config);
};
