import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { transactionQueue } from "../../../domain/services/SimpleQueueService/TransactionQueue";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";

export default class AddTransactionUseCase implements UseCase<any> {
  constructor() {}

  async execute(request: Request): Promise<HttpResponse<any>> {
    const { body } = request;

    await transactionQueue.enqueue({
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
