import GetTransactionStatusUseCase from "../../../application/usecases/transaction/GetTransactionStatusUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { TransactionModel } from "../../../domain/models/Transaction";
import TransactionRepository from "../../../infra/database/transaction_repository";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class GetTransactionStatusComposer implements Composer {
  static compose(): DefaultRouter {
    const repository = new TransactionRepository(TransactionModel);
    const useCase = new GetTransactionStatusUseCase(repository);

    return new DefaultRouter(useCase);
  }
}
