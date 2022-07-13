import { plainToClass } from "class-transformer";
import CreateDepartmentDto from "../dto/CreateDepartmentDto";
import { Department } from "../entities/Department";
import EntityAlreadyExists from "../exception/EntityAlreadyExists";
import EntityNotFoundException from "../exception/EntityNotFoundException";
import InternalServerError from "../exception/InternalServerError";
import { DepartmentRepository } from "../repository/DepartmentRepository";
import { ErrorCodes } from "../util/errorCode";

export class DepartmentService {
    constructor(private departmentRepo: DepartmentRepository) { }

    async getAllDepartments() {
        return await this.departmentRepo.getAllDepartments();
    }

    async createDepartment(departmentData: CreateDepartmentDto) {
        const conflictingDepartment =
            await this.departmentRepo.getDepartmentByName(departmentData.name, true);
        if (conflictingDepartment) {
            throw new EntityAlreadyExists(ErrorCodes.DEPARTMENT_ALREADY_EXISTS);
        }

        const department = plainToClass(Department, {
            name: departmentData.name
        })
        const newDepartment = await this.departmentRepo.createDepartment(department);
        return newDepartment;
    }

    async deleteDepartment(id: string) {
        const department = await this.departmentRepo.getDepartmentById(id);
        if(! department) {
            throw new EntityNotFoundException(ErrorCodes.DEPARTMENT_WITH_ID_NOT_FOUND);
        }

        const deleteResult = await this.departmentRepo.deleteDepartment(id);
        if(! deleteResult.affected) {
            throw new InternalServerError();
        }

        return deleteResult;
    }
}