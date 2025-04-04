import { Request, Response } from "express";
import DefaultRouter from "../../utils/helpers/default-router";

export default class ExpressRouterAdapter {
    static adapt(router: DefaultRouter) {
      return async (request: Request, response: Response) => {
        const httpResponse = await router.route(request);
  
        return response.status(httpResponse.statusCode).json(httpResponse.body);
      };
    }
  }
  