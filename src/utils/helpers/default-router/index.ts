import { Request } from "express";
import { HttpStatusCode } from "../protocols";
import exceptionHandler from "../../exceptionHandler";
import UseCase from "../../../domain/interfaces/UseCase";

interface HttpResponse {
  statusCode: HttpStatusCode;
  body: any;
}

export default class DefaultRouter {
  private readonly useCase: UseCase<any>;

  constructor(useCase: UseCase<any>) {
    this.useCase = useCase;
  }

  async route(httpRequest: Request): Promise<HttpResponse> {
    try {
      const defaultResult: HttpResponse = await this.useCase.execute(httpRequest);

      return defaultResult;
    } catch (err) {
      const error = err as Error;

      return exceptionHandler(error);
    }
  }
}
