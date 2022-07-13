import { getConnection } from "typeorm";
import { Department } from "../entities/Department";

export class DepartmentRepository {
  getAllDepartments() {
    const departmentRepo = getConnection().getRepository(Department);
    return departmentRepo.find();
  }

  createDepartment(department: Department) {
    const departmentRepo = getConnection().getRepository(Department);
    const newDepartment = departmentRepo.create(department);
    return newDepartment.save();
  }

  deleteDepartment(id: string) {
    const departmentRepo = getConnection().getRepository(Department);
    return departmentRepo.softDelete({ id });
  }

  getDepartmentById(id: string) {
    const departmentRepo = getConnection().getRepository(Department);
    return departmentRepo.findOne(id);
  }

  getDepartmentByName(name: string, withDeleted: boolean = false) {
    const departmentRepo = getConnection().getRepository(Department);
    return departmentRepo.findOne({ where: { name }, withDeleted });
  }
}