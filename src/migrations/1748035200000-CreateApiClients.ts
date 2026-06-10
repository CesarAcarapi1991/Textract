import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApiClients1748035200000 implements MigrationInterface {
  name = 'CreateApiClients1748035200000_v001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DATABASE_SCHEMA ?? 'public';
    const qualified = `"${schema}"`;

    // Schema must already exist (e.g. Supabase user schema). Enable pgcrypto in dashboard if needed.
    await queryRunner.query(`
      CREATE TABLE ${qualified}."api_clients_acarapi" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "api_key" text NOT NULL,
        "api_secret_hash" text NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_api_clients_api_key_acarapi" UNIQUE ("api_key")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DATABASE_SCHEMA ?? 'public';
    const qualified = `"${schema}"`;

    await queryRunner.query(`DROP TABLE IF EXISTS ${qualified}."api_clients"`);
  }
}
