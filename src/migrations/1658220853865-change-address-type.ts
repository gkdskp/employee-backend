import {MigrationInterface, QueryRunner} from "typeorm";

export class changeAddressType1658220853865 implements MigrationInterface {
    name = 'changeAddressType1658220853865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_2a4f5082f1be346e2b8cdec2194"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "address_id" TO "address"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME CONSTRAINT "UQ_2a4f5082f1be346e2b8cdec2194" TO "UQ_ad6f816c5fd4573342f870d4d28"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "UQ_ad6f816c5fd4573342f870d4d28"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "address" uuid`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "UQ_ad6f816c5fd4573342f870d4d28" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME CONSTRAINT "UQ_ad6f816c5fd4573342f870d4d28" TO "UQ_2a4f5082f1be346e2b8cdec2194"`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "address" TO "address_id"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_2a4f5082f1be346e2b8cdec2194" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
