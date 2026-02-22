import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
