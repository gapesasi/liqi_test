import dynamoose from "dynamoose";
import { awsConfig } from "./aws.config";

export const startDynamoose = () => {
  const config = new dynamoose.aws.ddb.DynamoDB({
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    },
    region: awsConfig.region,
    endpoint: awsConfig.dynamoUrl,
  });

  dynamoose.aws.ddb.set(config);
};
