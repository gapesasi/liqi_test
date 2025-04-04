import { NotFoundError } from "dynamode/utils";
import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { ITransactionRepository } from "../../../infra/database/transaction_repository/interface";
import { BadRequestError } from "../../../utils/error";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";

export default class GetTransactionStatusUseCase implements UseCase<{ status: string }> {
  constructor(private readonly repository: ITransactionRepository) {}

  async execute(request: Request): Promise<HttpResponse<{ status: string }>> {
    const id = request.params.id; 

    if (!id) {
      throw new BadRequestError("Transaction id is required");
    }

    const status = await this.repository.findStatusById(id);

    if (!status) {
      throw new NotFoundError("Transaction status with id given not found");
    }

    return {
      statusCode: HttpStatusCode.OK,
      body: {
        status,
      },
    };
  }
}
