import { plainToClass } from "class-transformer";
import AddressDto from "../dto/AddressDto";
import { Address } from "../entities/Address";
import { AddressRepository } from "../repository/AddressRepository";

export class AddressService {
    constructor(private addressRepo: AddressRepository) { }

    createAddress(addressData: AddressDto) {
        const address = plainToClass(Address, {
            zip: addressData.zip,
            city: addressData.city,
            district: addressData.district,
            state: addressData.state
        });
        return this.addressRepo.createAddress(address);
    }
}