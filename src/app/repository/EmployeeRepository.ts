import { getConnection } from "typeorm";
import { Employee } from "../entities/Employee";

export class EmployeeRespository {
  getAllEmployees() {
    const employeeRepo = getConnection().getRepository(Employee);
    return employeeRepo.find({ relations: ['department'] });
  }

  addEmployee(employee: Employee) {
    const employeeRepo = getConnection().getRepository(Employee);
    const newEmployee = employeeRepo.create(employee);
    return newEmployee.save();
  }

  updateEmployee(id: string, updatedEmployee: Employee) {
    const employeeRepo = getConnection().getRepository(Employee);
    return employeeRepo.update({ id }, updatedEmployee);
  }

  getEmployeeById(id: string) {
    const employeeRepo = getConnection().getRepository(Employee);
    return employeeRepo.findOne(id, { relations: ['department'] });
  }

  deleteEmployee(id: string) {
    const employeeRepo = getConnection().getRepository(Employee);
    return employeeRepo.softDelete({ id });
  }

  getEmployeeAddressId(id: string) {
    const employeeRepo = getConnection().getRepository(Employee);
    return employeeRepo.findOne(id, { select: ['address'] });
  }

  public async getEmployeeByName(name: string) {
    const employeeRepo = getConnection().getRepository(Employee);
    const employeeDetail = await employeeRepo.findOne({
      where: { name },
    });
    return employeeDetail;
  }
}