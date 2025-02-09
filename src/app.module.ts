import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { UserModule } from './user/user.module';
import * as winston from 'winston';
import jwtConfig from '@shared/config/jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisConfig from '@shared/config/redis.config';
import { GlobalHttpModule } from './http/global-http.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, redisConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => 
        {
          const { host, port, password, ttl } = configService.get('redis')
          return {
            store: redisStore, 
            host,
            port,
            auth_pass: password,
            tls: ttl
          }
      }
    }),
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        // Un-comment below transport to log into file
        // new winston.transports.File({
        //   filename: 'app.log',
        //   format: winston.format.combine(
        //     winston.format.timestamp(),
        //     winston.format.prettyPrint(),
        //   ),
        // })
      ],
    }),
    UserModule,
    AuthModule,
    GlobalHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
