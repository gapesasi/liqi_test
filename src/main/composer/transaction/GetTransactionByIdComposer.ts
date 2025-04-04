import GetTransactionByIdUseCase from "../../../application/usecases/transaction/GetTransactionByIdUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { TransactionModel } from "../../../domain/models/Transaction";
import TransactionRepository from "../../../infra/database/transaction_repository";
import DefaultRouter from "../../../utils/helpers/default-router";

export default class GetTransactionByIdComposer implements Composer {
  static compose(): DefaultRouter {
    const repository = new TransactionRepository(TransactionModel);
    const useCase = new GetTransactionByIdUseCase(repository);

    return new DefaultRouter(useCase);
  }
}
