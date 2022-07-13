import { BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class AbstractEntity extends BaseEntity {
    @CreateDateColumn()
    public createdAt?: Date;

    @UpdateDateColumn()
    public updatedAt?: Date;
    
    @DeleteDateColumn({ select: false })
    public deletedAt?: Date;
}