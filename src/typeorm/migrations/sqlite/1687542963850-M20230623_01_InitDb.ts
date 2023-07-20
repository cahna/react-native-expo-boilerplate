/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial database migration.
 */
export class M2023062301InitDb1687542963850 implements MigrationInterface {
  name = 'M2023062301InitDb1687542963850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "scoreValue" decimal(10,2) NOT NULL, "email" varchar(64) NOT NULL, CONSTRAINT "UQ_3d46d84e2bbb09d8830bba3415a" UNIQUE ("email"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
