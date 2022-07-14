import { PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { EmployeeRole, Status } from "../util/enums";
import { AbstractEntity } from "./AbstractEntity";
import { Address } from "./Address";
import { Department } from "./Department";

@Entity("employee")
export class Employee extends AbstractEntity {
    @PrimaryColumn()
    public id: string;

    @Column({ nullable: false })
    public name: string;

    @Column({ nullable: false })
    public email: string;

    @Column({ nullable:true })
    public password: string;

    @Column({ nullable: false })
    public joiningDate: Date;

    @Column({ nullable: false })
    public role: EmployeeRole;

    @Column({ nullable: false })
    public status: Status;

    @Column({ nullable: false })
    public experience: Number;

    @ManyToOne(() => Department, { cascade: true })
    @JoinColumn()
    public department: Department;

    @OneToOne(() => Address, { cascade: true })
    @JoinColumn()
    address: Address;

    @Column({ nullable: true })
    idProofPath: string;

    @Column({ nullable: false })
    public departmentId: string;
}