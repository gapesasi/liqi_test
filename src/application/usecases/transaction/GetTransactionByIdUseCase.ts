import { NotFoundError } from "dynamode/utils";
import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { Transaction } from "../../../domain/models/Transaction";
import { ITransactionRepository } from "../../../infra/database/transaction_repository/interface";
import { BadRequestError } from "../../../utils/error";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";

export default class GetTransactionByIdUseCase implements UseCase<Transaction> {
  constructor(private readonly repository: ITransactionRepository) {}

  async execute(request: Request): Promise<HttpResponse<Transaction>> {
    const id = Number(request.params.id);

    if (!id) {
      throw new BadRequestError("Transaction id is required");
    }

    const transaction = await this.repository.findById(id);

    if (!transaction) {
      throw new NotFoundError("Transaction with id given not found");
    }

    return {
      statusCode: HttpStatusCode.OK,
      body: transaction,
    };
  }
}
