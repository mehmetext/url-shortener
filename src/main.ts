import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BaseResponseInterceptor } from './shared/interceptors/base-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setDescription('The URL Shortener API description')
    .setVersion('1.0')
    .addTag('url-shortener')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalInterceptors(new BaseResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
