import AddTransactionUseCase from "../../../application/usecases/transaction/AddTransactionUseCase";
import Composer from "../../../domain/abstracts/Composer";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class AddTransactionComposer implements Composer {
  static compose(): DefaultRouter {
    const useCase = new AddTransactionUseCase();

    return new DefaultRouter(useCase);
  }
}
