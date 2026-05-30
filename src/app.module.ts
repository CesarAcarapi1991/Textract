import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { Modulo1Module } from './modulo1/modulo1.module';
import { Modulo2Module } from './modulo2/modulo2.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    Modulo1Module,
    Modulo2Module,
  ],
})
export class AppModule {}
