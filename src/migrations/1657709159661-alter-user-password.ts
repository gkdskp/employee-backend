import {MigrationInterface, QueryRunner} from "typeorm";

export class alterUserPassword1657709159661 implements MigrationInterface {
    name = 'alterUserPassword1657709159661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "password"`);
    }

}
