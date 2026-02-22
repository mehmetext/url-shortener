import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/infra/auth.module';
import { UrlModule } from './modules/url/infra/url.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UrlModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        stores: [
          new Keyv({
            store: new KeyvRedis(configService.getOrThrow<string>('REDIS_URL')),
            ttl: 60 * 60 * 24,
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
