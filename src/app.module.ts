import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
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
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UserController } from './user/user.controller';
import { WordsModule } from './words/words.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
        const defaultConfig = {
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          entities: ['dist/**/**.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
        };
        if (database.type === 'postgres') {
          return {
            type: 'postgres',
            ...defaultConfig,
          };
        }
        return {
          type: 'mysql',
          ...defaultConfig,
          dateStrings: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    WordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: '/user',
        method: RequestMethod.POST,
      })
      .forRoutes(
        {
          path: '/current-word/',
          method: RequestMethod.GET,
        },
        {
          path: '/current-word/',
          method: RequestMethod.GET,
        },
        UserController,
      );
  }
}
