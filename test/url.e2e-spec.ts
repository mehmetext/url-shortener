import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'http';
import { AppModule } from 'src/app.module';
import { BaseResponseInterceptor } from 'src/shared/interceptors/base-response.interceptor';
import request from 'supertest';

describe('UrlController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          const errorMessages = errors.flatMap((error) =>
            Object.values(error.constraints ?? {}),
          );

          return new BadRequestException(errorMessages);
        },
      }),
    );

    app.useGlobalInterceptors(new BaseResponseInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  type PShortenResponseBody = {
    success: boolean;
    data: {
      originalUrl: string;
      shortCode: string;
    };
  };

  it('POST /urls/p-shorten - Geçerli bir URL ile kısa link oluşturmalı', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/urls/p-shorten')
      .send({ originalUrl: 'https://github.com' });

    expect(res.status).toBe(201);

    const body = res.body as PShortenResponseBody;
    expect(body.success).toBe(true);
    expect(body.data.originalUrl).toBe('https://github.com');
    expect(body.data.shortCode).toBeDefined();
    expect(typeof body.data.shortCode).toBe('string');
  });

  it('POST /urls/p-shorten - Geçersiz (URL olmayan) bir metin atıldığında 400 Bad Request fırlatmalı', async () => {
    const res = await request(app.getHttpServer() as Server)
      .post('/urls/p-shorten')
      .send({ originalUrl: 'sadece-bir-metin-bu-url-degil' });

    expect(res.status).toBe(400);

    const body = res.body as PShortenResponseBody;
    expect(body.success).toBe(false);
  });
});
