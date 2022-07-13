import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";

class HealthController extends AbstractController {
  constructor() {
    super(`${APP_CONSTANTS.apiPrefix}/health`);
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}`, this.healthResponse);
  }
  
  private healthResponse = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const data: any = { message: "Service Up"};
      response.status(200);
      response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
    } catch (error) {
      return next(error);
    }
  }
}

export default HealthController;
