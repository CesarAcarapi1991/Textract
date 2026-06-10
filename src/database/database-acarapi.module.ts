import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolvePostgresConnection } from './data-source-acarapi';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { url, ssl } = resolvePostgresConnection(
          config.getOrThrow<string>('DATABASE_URL'),
        );

        return {
          type: 'postgres' as const,
          url,
          schema: config.get<string>('DATABASE_SCHEMA', 'public'),
          autoLoadEntities: true,
          synchronize: false,
          ssl,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
