import { IsAlphanumeric } from "class-validator";

export default class CreateDepartmentDto {
    @IsAlphanumeric()
    public name: string;
}