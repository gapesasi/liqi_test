import GetTransactionByPeriodsUseCase from "../../../application/usecases/transaction/GetTransactionByPeriodsUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { TransactionModel } from "../../../domain/models/Transaction";
import TransactionRepository from "../../../infra/database/transaction_repository";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class GetTransactionByPeriodsComposer implements Composer {
  static compose(): DefaultRouter {
    const repository = new TransactionRepository(TransactionModel);
    const useCase = new GetTransactionByPeriodsUseCase(repository);

    return new DefaultRouter(useCase);
  }
}
