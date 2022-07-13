import { getConnection } from "typeorm";
import { Address } from "../entities/Address";

export class AddressRepository {
    createAddress(address: Address) {
        const addressRepo = getConnection().getRepository(Address);
        const newAddress = addressRepo.create(address);
        return newAddress.save();
    }
}