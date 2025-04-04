import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";
import { Account } from "../../../domain/models/Account";
import { IAccountRepository } from "../../../infra/database/account_repository/interface";

export default class ListAccountsUseCase implements UseCase<Account[]> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(request: Request): Promise<HttpResponse<any>> {
    const accounts = await this.accountRepository.list();

    return {
      statusCode: HttpStatusCode.OK,
      body: accounts,
    };
  }
}
