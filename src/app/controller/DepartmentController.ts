import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { DepartmentService } from "../service/DepartmentService";
import authorize from "../middleware/authenticationMiddleware";
import { EmployeeRole } from "../util/enums";

class DepartmentController extends AbstractController {
  constructor(private departmentService: DepartmentService) {
    super(`${APP_CONSTANTS.apiPrefix}/department`);
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}`, this.asyncRouteHandler(this.getAllDepartments));
    
    this.router.post(
      `${this.path}`, 
      authorize([EmployeeRole.Admin, EmployeeRole.HR]),
      this.asyncRouteHandler(this.createDepartment)
    );
    
    this.router.delete(
      `${this.path}/:id`,
      authorize([EmployeeRole.Admin, EmployeeRole.HR]),
      this.asyncRouteHandler(this.deleteDepartment)
    );
  }

  private getAllDepartments = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const departments = await this.departmentService.getAllDepartments();

    response.status(200);
    response.send(this.fmt.formatResponse(
      departments,
      Date.now() - request.startTime,
      "OK",
      departments.length
    ));
  }

  private createDepartment = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const departmentData = request.body;
    const newDepartment = await this.departmentService.createDepartment(departmentData);

    response.status(200);
    response.send(this.fmt.formatResponse(
      newDepartment,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }

  private deleteDepartment = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const { id } = request.params;
    await this.departmentService.deleteDepartment(id);

    response.status(200);
    response.send(this.fmt.formatResponse(
      null,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }
}

export default DepartmentController;
