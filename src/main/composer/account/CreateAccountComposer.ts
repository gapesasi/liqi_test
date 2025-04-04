import CreateAccountUseCase from "../../../application/usecases/account/CreateAccountUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { AccountModel } from "../../../domain/models/Account";
import { AccountRepository } from "../../../infra/database/account_repository";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class CreateAccountComposer implements Composer {
  static compose(): DefaultRouter {
    const repository = new AccountRepository(AccountModel);

    const useCase = new CreateAccountUseCase(repository);

    return new DefaultRouter(useCase);
  }
}
