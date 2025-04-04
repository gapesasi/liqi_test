import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import SimpleQueueService from "../../../domain/services/SimpleQueueService";
import { TransactionPayload } from "../../../domain/services/TransactionService/types";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";

export default class AddTransactionUseCase implements UseCase<{ message: string }> {
  constructor(private readonly transactionQueue: SimpleQueueService<TransactionPayload>) {}

  async execute(request: Request): Promise<HttpResponse<{ message: string }>> {
    const { body } = request;

    await this.transactionQueue.enqueue({
      transaction_id: "",
      value: body.value,
      type: body.type,
      origin: body.origin,
      target: body.target,
    });

    return {
      statusCode: HttpStatusCode.OK,
      body: {
        message: "Transaction Added",
      },
    };
  }
}
