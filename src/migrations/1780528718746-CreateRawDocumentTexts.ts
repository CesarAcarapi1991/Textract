import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRawDocumentTexts1780528718746_v001 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DATABASE_SCHEMA ?? 'public';
    const qualified = `"${schema}"`;

    // Schema must already exist (e.g. Supabase user schema). Enable pgcrypto in dashboard if needed.
    await queryRunner.query(`
      CREATE TABLE ${qualified}."raw_document_texts_acarapi" (
        id SERIAL PRIMARY KEY,
        file_name TEXT NOT NULL,
        s3_key TEXT NOT NULL,
        extracted_text TEXT NOT NULL,
        line_count INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DATABASE_SCHEMA ?? 'public';
    const qualified = `"${schema}"`;

    await queryRunner.query(`DROP TABLE IF EXISTS ${qualified}."raw_document_texts_acarapi"`);
  }

}
