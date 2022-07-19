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
import InternalServerError from "../exception/InternalServerError";
import { AddressService } from "./AddressService";
import AddressDto from "../dto/AddressDto";
import EditEmployeeDto from "../dto/EditEmployeeDto";

export class EmployeeService {
    constructor(
        private employeeRepo: EmployeeRespository,
        private addressService: AddressService
    ) { }

    public async employeeLogin ( name: string, password: string ) {
        const employeeDetails = 
            await this.employeeRepo.getEmployeeByName(name);
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

    private generateAuthTokens(payload: any) {
        return jsonwebtoken.sign(payload, process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.ID_TOKEN_VALIDITY,
        });
    };


    getAllEmployees() {
        return this.employeeRepo.getAllEmployees();
    }

    async addEmployee(data: EmployeeWithAddressDto) {
        console.log(data);
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

    async updateEmployee(id: string, data: EditEmployeeDto) {
        const employee = await this.employeeRepo.getEmployeeById(id);

        if (!employee) {
            throw new EntityNotFoundException(ErrorCodes.USER_NOT_FOUND);
        }

        const updatedEmployee = plainToClass(Employee, data);
        const updateResult = await this.employeeRepo.updateEmployee(id, updatedEmployee);

        if(! updateResult.affected) {
            throw new InternalServerError();
        }

        return updateResult;
    }

    async getEmployeeById(id: string) {
        const employee = await this.employeeRepo.getEmployeeById(id);

        if (!employee) {
            throw new EntityNotFoundException(ErrorCodes.USER_NOT_FOUND);
        }

        return employee;
    }

    async deleteEmployee(id: string) {
        const employee = await this.employeeRepo.getEmployeeById(id);
        if(! employee) {
            throw new EntityNotFoundException(ErrorCodes.USER_WITH_ID_NOT_FOUND);
        }

        const deleteResult = await this.employeeRepo.deleteEmployee(id);
        if(! deleteResult.affected) {
            throw new InternalServerError();
        }

        return deleteResult;
    }

    async updateAddress(id: string, addressData: AddressDto) {
        const employee = await this.employeeRepo.getEmployeeById(id);
        if(! employee) {
            throw new EntityNotFoundException(ErrorCodes.USER_WITH_ID_NOT_FOUND);
        }

        const address = await this.addressService.createAddress(addressData);
        await this.updateEmployee(id, {
            address
        });

        return address;
    }
}