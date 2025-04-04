import { ModelType } from "dynamoose/dist/General";
import { TransactionValidations } from "../../../domain/models/TransactionValidations";
import {
  CreateTransactionValidationsProps,
  ITransactionValidationsRepository,
  UpdateTransactionValidationsProps,
} from "./interface";

export default class TransactionValidationsRepository implements ITransactionValidationsRepository {
  constructor(private readonly model: ModelType<TransactionValidations>) {}

  async create(props: CreateTransactionValidationsProps): Promise<TransactionValidations> {
    return await this.model.create({
      ...props,
    });
  }

  async findByTransactionId(transaction_id: string): Promise<TransactionValidations> {
    return await this.model.get({ transaction_id });
  }

  async update(props: UpdateTransactionValidationsProps): Promise<TransactionValidations> {
    const { transaction_id, ...rest } = props;

    const updateFields = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    return await this.model.update(
      {
        transaction_id,
      },
      {
        $SET: updateFields,
      }
    );
  }
}
