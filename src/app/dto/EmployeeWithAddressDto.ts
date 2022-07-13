import { Type } from "class-transformer";
import { IsString, IsEnum, IsInt, ValidateNested, IsDate, IsDefined } from "class-validator";
import { EmployeeRole, Status } from "../util/enums";
import AddressDto from "./AddressDto";

export default class EmployeeWithAddressDto {
    @IsString()
    public id: string;

    @IsString()
    public name: string;

    @IsString()
    public email: string;

    @IsInt()
    public experience: Number;

    @IsString()
    public password: string;

    @IsString()
    public departmentId: string;

    @IsDate()
    @Type(() => Date)
    public joiningDate: string;

    @IsEnum(EmployeeRole)
    public role: EmployeeRole;

    @IsEnum(Status)
    public status: Status;

    @IsString()
    public idProofPath: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => AddressDto)
    public address: AddressDto;
}