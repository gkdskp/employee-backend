import { IsInt, IsString } from "class-validator";

export default class AddressDto {
    @IsInt()
    public zip: Number;

    @IsString()
    public city: string;

    @IsString()
    public district: string;

    @IsString()
    public state: string;
}