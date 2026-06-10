/**
 * Insert a test API client. Run: npm run seed:api-client
 */
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { ApiClient } from '../src/entities/api-client-acarapi.entity';
import { resolvePostgresConnection } from '../src/database/data-source-acarapi';

config();

async function main(): Promise<void> {
  const schema = process.env.DATABASE_SCHEMA ?? 'public';
  const apiKey = process.env.SEED_API_KEY ?? 'test-api-key';
  const apiSecret = process.env.SEED_API_SECRET ?? 'test-api-secret';

  const { url, ssl } = resolvePostgresConnection(process.env.DATABASE_URL ?? '');

  const dataSource = new DataSource({
    type: 'postgres',
    url,
    schema,
    entities: [ApiClient],
    ssl,
  });

  await dataSource.initialize();
  const repo = dataSource.getRepository(ApiClient);

  const existing = await repo.findOne({ where: { apiKey } });
  if (existing) {
    console.log(`API client already exists for key: ${apiKey}`);
    await dataSource.destroy();
    return;
  }

  const hash = await bcrypt.hash(apiSecret, 10);
  await repo.save(
    repo.create({
      name: 'Test client',
      apiKey,
      apiSecretHash: hash,
      isActive: true,
    }),
  );

  console.log('Created API client:');
  console.log(`  x-api-key: ${apiKey}`);
  console.log(`  x-api-secret: ${apiSecret}`);

  await dataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
