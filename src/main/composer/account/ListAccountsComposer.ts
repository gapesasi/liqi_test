import ListAccountsUseCase from "../../../application/usecases/account/ListAccountsUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { AccountModel } from "../../../domain/models/Account";
import { AccountRepository } from "../../../infra/database/account_repository";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class ListAccountsComposer implements Composer {
  static compose(): DefaultRouter {
    const repository = new AccountRepository(AccountModel);

    const useCase = new ListAccountsUseCase(repository);

    return new DefaultRouter(useCase);
  }
}
