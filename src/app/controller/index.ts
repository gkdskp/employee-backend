/**
 * Wraps Controllers for easy import from other modules
 */
import { DepartmentRepository } from "../repository/DepartmentRepository";
import { EmployeeRespository } from "../repository/EmployeeRepository";
import { DepartmentService } from "../service/DepartmentService";
import { EmployeeService } from "../service/EmployeeService";
import DepartmentController from "./DepartmentController";
import EmployeeController from "./EmployeeController";
import HealthController from "./HealthController";

const employeeRepo = new EmployeeRespository();
const departmentRepo = new DepartmentRepository();

const departmentService = new DepartmentService(departmentRepo);
const employeeService = new EmployeeService(employeeRepo);

const healthController = new HealthController();
const employeeController = new EmployeeController(employeeService);
const departmentController = new DepartmentController(departmentService);

export default [
  healthController,
  employeeController,
  departmentController
];
