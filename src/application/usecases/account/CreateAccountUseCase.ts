import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";

export default class CreateAccountUseCase implements UseCase<any> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(request: Request): Promise<HttpResponse<any>> {
    const { body } = request;

    const account = await this.accountRepository.create(body);

    return {
      statusCode: HttpStatusCode.OK,
      body: account,
    };
  }
}
