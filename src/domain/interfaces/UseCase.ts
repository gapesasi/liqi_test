import { Request } from "express";
import { HttpResponse } from "../../utils/helpers/protocols";

export default interface UseCase<T> {
  execute(request: Request): Promise<HttpResponse<T>>;
}
