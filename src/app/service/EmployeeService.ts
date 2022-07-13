import { plainToClass } from "class-transformer";
import EmployeeWithAddressDto from "../dto/EmployeeWithAddressDto";
import { Employee } from "../entities/Employee";
import EntityNotFoundException from "../exception/EntityNotFoundException";
import { EmployeeRespository } from "../repository/EmployeeRepository";
import { ErrorCodes } from "../util/errorCode";
import bcrypt from "bcrypt";
import EntityAlreadyExists from "../exception/EntityAlreadyExists";
import jsonwebtoken from "jsonwebtoken";
import UserNotAuthorizedException from "../exception/UserNotAuthorizedException";
import IncorrectUsernameOrPasswordException from "../exception/IncorrectUsernameOrPasswordException";

export class EmployeeService {
    constructor(
        private employeeRepo: EmployeeRespository
    ) { }

    public employeeLogin = async (
        name: string,
        password: string
    ) => {
        const employeeDetails = await this.employeeRepo.getEmployeeByName(
            name
        );
        if (!employeeDetails) {
            throw new UserNotAuthorizedException();
        }

        const validPassword = await bcrypt.compare(password, employeeDetails.password);

        if (validPassword) {
            let payload = {
                "custom:id": employeeDetails.id,
                "custom:name": employeeDetails.name,
                "custom:role": employeeDetails.role
            };
            const token = this.generateAuthTokens(payload);

            return {
                idToken: token,
                employeeDetails,
            };
        } else {
            throw new IncorrectUsernameOrPasswordException();
        }
    };

    private generateAuthTokens = (payload: any) => {
        return jsonwebtoken.sign(payload, process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.ID_TOKEN_VALIDITY,
        });
    };


    getAllEmployees() {
        return this.employeeRepo.getAllEmployees();
    }

    async addEmployee(data: EmployeeWithAddressDto) {
        const employee = await this.employeeRepo.getEmployeeById(data.id);

        if (employee) {
            throw new EntityAlreadyExists(ErrorCodes.USER_ALREADY_EXISTS);
        }

        const newEmployee = plainToClass(Employee, {
            id: data.id,
            name: data.name,
            email: data.email,
            joiningDate: data.joiningDate,
            role: data.role,
            status: data.status,
            experience: data.experience,
            idProofPath: data.idProofPath,
            departmentId: data.departmentId,
            password: data.password ? await bcrypt.hash(data.password, 10) : '',
            address: data.address
        });

        return this.employeeRepo.addEmployee(newEmployee);
    }

    async updateEmployee(data: { [key: string]: any }) {
        const addressId = await this.employeeRepo.getEmployeeAddressId(data.id);
        // return this.employeeRepo.updateEmployee(this.createEmployee(data));
    }

    async getEmployeeById(id: string) {
        const employee = await this.employeeRepo.getEmployeeById(id);

        if (!employee) {
            throw new EntityNotFoundException(ErrorCodes.USER_NOT_FOUND);
        }

        return employee;
    }

    deleteEmployee(id: string) {
        return this.employeeRepo.deleteEmployee(id);
    }
}