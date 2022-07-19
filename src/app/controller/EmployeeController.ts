import { AbstractController } from "../util/rest/controller";
import { NextFunction, Response } from "express";
import RequestWithUser from "../util/rest/request";
import APP_CONSTANTS from "../constants";
import { EmployeeService } from "../service/EmployeeService";
import validationMiddleware from "../middleware/validationMiddleware";
import EmployeeWithAddressDto from "../dto/EmployeeWithAddressDto";
import authorize from "../middleware/authenticationMiddleware";
import { EmployeeRole } from "../util/enums";
import AddressDto from "../dto/AddressDto";
import EditEmployeeDto from "../dto/EditEmployeeDto";

class EmployeeController extends AbstractController {
  constructor(private employeeService: EmployeeService) {
    super(`${APP_CONSTANTS.apiPrefix}/employee`);
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      this.asyncRouteHandler(this.login)
    );

    this.router.get(
      `${this.path}`,
      // authorize(),
      this.asyncRouteHandler(this.getAllEmployees)
    );

    this.router.get(
      `${this.path}/:id`,
      // authorize(),
      this.asyncRouteHandler(this.getEmployeeById)
    );

    this.router.post(
      `${this.path}`,
      // authorize([EmployeeRole.Admin, EmployeeRole.HR]),
      // validationMiddleware(EmployeeWithAddressDto, APP_CONSTANTS.body),
      this.asyncRouteHandler(this.addEmployee)
    );

    this.router.delete(
      `${this.path}/:id`,
      // authorize([EmployeeRole.Admin, EmployeeRole.HR]),
      this.asyncRouteHandler(this.deleteEmployee)
    );

    this.router.post(
      `${this.path}/:id/address`,
      authorize([EmployeeRole.Admin, EmployeeRole.HR]),
      validationMiddleware(AddressDto, APP_CONSTANTS.body),
      this.asyncRouteHandler(this.updateUserAddress)
    );

    this.router.put(
      `${this.path}/:id`,
      // authorize([EmployeeRole.Admin, EmployeeRole.HR]),
      // validationMiddleware(EditEmployeeDto, APP_CONSTANTS.body, true),
      this.asyncRouteHandler(this.updateEmployee)
    );
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

  private getAllEmployees = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const employees = await this.employeeService.getAllEmployees();
    response.status(200);
    response.send(this.fmt.formatResponse(
      employees,
      Date.now() - request.startTime,
      "OK",
      employees.length
    ));
  }

  private getEmployeeById = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params;
    const data = await this.employeeService.getEmployeeById(id);

    response.status(200);
    response.send(this.fmt.formatResponse(
      data,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }

  private addEmployee = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    console.log(request.body);
    const employee = await this.employeeService.addEmployee(request.body);

    response.status(200);
    response.send(this.fmt.formatResponse(
      employee,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }


  private updateEmployee = async (
    request: RequestWithUser, 
    response: Response, 
    next: NextFunction
  ) => {
    const { id } = request.params;
    const updateData = request.body;
    await this.employeeService.updateEmployee(id, updateData);

    response.status(200);
    response.send(this.fmt.formatResponse(
      null,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }

  public deleteEmployee = async (
    request: RequestWithUser, 
    response: Response, 
    next: NextFunction
  ) => {
    const { id } = request.params;
    await this.employeeService.deleteEmployee(id);

    response.status(200);
    response.send(this.fmt.formatResponse(
      null,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }

  public updateUserAddress = async (
    request: RequestWithUser, 
    response: Response, 
    next: NextFunction
  ) => {
    const { id } = request.params;
    const addressDetails = request.body;
    const address = await this.employeeService.updateAddress(id, addressDetails);

    response.status(200);
    response.send(this.fmt.formatResponse(
      address,
      Date.now() - request.startTime,
      "OK",
      1
    ));
  }
}

export default EmployeeController;
