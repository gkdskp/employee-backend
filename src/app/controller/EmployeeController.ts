import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { EmployeeService } from "../service/EmployeeService";
import validationMiddleware from "../middleware/validationMiddleware";
import EmployeeWithAddressDto from "../dto/EmployeeWithAddressDto";
import authorize from "../middleware/authenticationMiddleware";
import { EmployeeRole } from "../util/enums";

class EmployeeController extends AbstractController {
  constructor(private employeeService: EmployeeService) {
    super(`${APP_CONSTANTS.apiPrefix}/employee`);
    this.initializeRoutes();
  }

  private login = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const loginData = request.body;
    const loginDetail = await this.employeeService.employeeLogin(
      loginData.name.toLowerCase(),
      loginData.password
    );
    response.send(
      this.fmt.formatResponse(loginDetail, Date.now() - request.startTime, "OK")
    );
  };

  protected initializeRoutes() {
    this.router.get(`${this.path}`, authorize([EmployeeRole.HR]), this.getAllEmployees);
    this.router.get(`${this.path}/:id`, this.getEmployeeById);
    this.router.post(
      `${this.path}`,
      validationMiddleware(EmployeeWithAddressDto, APP_CONSTANTS.body),
      this.addEmployee
    );
    this.router.delete(`${this.path}/:id`, this.deleteEmployee);
    this.router.put(`${this.path}/:id`, this.updateEmployee);
    this.router.post(
      `${this.path}/login`,
      this.login
    );
  }

  private getAllEmployees = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      response.status(200);
      response.send(this.fmt.formatResponse(employees, Date.now() - request.startTime, "OK", employees.length));
    } catch (error) {
      return next(error);
    }
  }

  private getEmployeeById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const data = await this.employeeService.getEmployeeById(id);

      response.status(200);
      response.send(this.fmt.formatResponse(data, Date.now() - request.startTime, "OK", 1));
    } catch (error) {
      return next(error);
    }
  }

  private addEmployee = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      response.status(200);
      response.send(await this.employeeService.addEmployee(request.body));
    } catch (error) {
      return next(error);
    }
  }


  private updateEmployee = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      const {
        name,
        email,
        joiningDate,
        role,
        status,
        experience,
        departmentId,
        zip,
        city,
        district,
        state,
        idProofPath
      } = request.body;

      response.status(200);
      response.send(await this.employeeService.updateEmployee({
        id,
        name,
        email,
        joiningDate,
        role,
        status,
        experience,
        departmentId,
        zip,
        city,
        district,
        state,
        idProofPath
      }));
    } catch (error) {
      return next(error);
    }
  }

  // public updateEmployee = async (request: RequestWithUser, response: Response, next: NextFunction) => {
  //   try {
  //     const { name, email } = request.body;
  //     response.status(200);
  //     response.send(await this.employeeService.createEmployee(name, email));
  //   } catch (error) {
  //     return next(error);
  //   }
  // }

  public deleteEmployee = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;
      response.status(200);
      response.send(await this.employeeService.deleteEmployee(id));
    } catch (error) {
      return next(error);
    }
  }


}

export default EmployeeController;
