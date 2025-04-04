import { Request } from "express";
import { HttpStatusCode } from "../protocols";
import exceptionHandler from "../../exceptionHandler";

interface HttpResponse {
  statusCode: HttpStatusCode;
  body: any;
}

interface UseCase {
  execute: (request: any) => Promise<HttpResponse | any>;
}

export default class DefaultRouter {
  private readonly useCase: UseCase;

  constructor(useCase: UseCase) {
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
