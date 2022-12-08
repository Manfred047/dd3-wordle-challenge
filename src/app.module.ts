import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigValidator } from './config/config.validator';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigInterface } from './config/interfaces/database.config.interface';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validationSchema: ConfigValidator,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const database: DatabaseConfigInterface =
          configService.get<DatabaseConfigInterface>('database');
        return {
          type: 'mysql',
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          entities: ['dist/**/**.entity{.ts,.js}'],
          synchronize: false,
          dateStrings: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
