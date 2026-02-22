import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './modules/url/infra/url.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
