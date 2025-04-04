import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { ITransactionRepository } from "../../../infra/database/transaction_repository/interface";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";
import { Transaction } from "../../../domain/models/Transaction";

export default class GetTransactionByPeriodsUseCase implements UseCase<Transaction[]> {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(request: Request): Promise<HttpResponse<Transaction[]>> {
    const startPeriod = new Date(request.query.startPeriod as string).getTime();
    let endPeriod = undefined;
    if (request.query.endPeriod) endPeriod = new Date(request.query.endPeriod as string).getTime();

    const periods = await this.transactionRepository.findByPeriods(
      startPeriod,
      endPeriod
    );

    return {
      statusCode: HttpStatusCode.OK,
      body: periods ?? [],
    };
  }
}
