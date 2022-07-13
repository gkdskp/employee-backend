import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";

@Entity("address")
export class Address extends AbstractEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ nullable: false })
    public zip: Number;

    @Column({ nullable: false })
    public city: String;

    @Column({ nullable: false })
    public district: String;

    @Column({ nullable: false })
    public state: String;
}