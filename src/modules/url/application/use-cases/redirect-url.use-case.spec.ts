import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Url, UrlPrimitives } from '../../domain/entities/url.entity';
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors';
import { UrlRedirectedEvent } from '../../domain/events/url-redirected.event';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';
import {
  URL_CACHE_KEY,
  URL_CACHE_NOT_FOUND_TTL_MS,
  URL_CACHE_TTL_MS,
} from '../config/url-cache.config';
import { RedirectUrlCommand } from '../dtos/redirect-url.command';
import { RedirectUrlUseCase } from './redirect-url.use-case';

describe('RedirectUrlUseCase', () => {
  let useCase: RedirectUrlUseCase;

  type UrlRepositoryMock = {
    create: jest.Mock<Promise<Url>, [Url]>;
    findByShortCode: jest.Mock<Promise<Url | null>, [string]>;
    findById: jest.Mock<any, any>;
    findAllByUserId: jest.Mock<any, any>;
    delete: jest.Mock<any, any>;
  };

  const mockUrlRepository: UrlRepositoryMock = {
    create: jest.fn<Promise<Url>, [Url]>(),
    findByShortCode: jest.fn<Promise<Url | null>, [string]>(),
    findById: jest.fn(),
    findAllByUserId: jest.fn(),
    delete: jest.fn(),
  };

  type CacheManagerMock = {
    get: jest.Mock<
      Promise<UrlPrimitives | { notFound: true } | null>,
      [string]
    >;
    set: jest.Mock<Promise<void>, [string, unknown, number]>;
    del: jest.Mock<Promise<void>, [string]>;
  };

  const mockCacheManager: CacheManagerMock = {
    get: jest.fn<
      Promise<UrlPrimitives | { notFound: true } | null>,
      [string]
    >(),
    set: jest.fn<Promise<void>, [string, unknown, number]>(),
    del: jest.fn<Promise<void>, [string]>(),
  };

  type EventEmitter2Mock = {
    emit: jest.Mock<void, [string, UrlRedirectedEvent]>;
  };

  const mockEventEmitter: EventEmitter2Mock = {
    emit: jest.fn<void, [string, UrlRedirectedEvent]>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectUrlUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    useCase = module.get<RedirectUrlUseCase>(RedirectUrlUseCase);
  });

  const makeUrl = (overrides?: Partial<UrlPrimitives>): Url => {
    const now = new Date();
    const primitives: UrlPrimitives = {
      id: 'url-id',
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
      expiresAt: new Date(now.getTime() + 60_000).toISOString(),
      userId: 'user-1',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      deletedAt: null,
      ...overrides,
    };

    return Url.fromPrimitives(primitives);
  };

  it('should return URL from cache and emit event when cached and not expired', async () => {
    const url = makeUrl();
    const cached: UrlPrimitives = url.toPrimitives();
    const command: RedirectUrlCommand = {
      shortCode: url.shortCode.value,
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    };

    mockCacheManager.get.mockResolvedValue(cached);

    const result = await useCase.execute(command);

    expect(mockCacheManager.get).toHaveBeenCalledWith(
      URL_CACHE_KEY(command.shortCode),
    );
    expect(mockUrlRepository.findByShortCode).not.toHaveBeenCalled();

    expect(result).toEqual({
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt,
      userId: url.userId,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    });

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
    const [eventName, event] = mockEventEmitter.emit.mock.calls[0];
    expect(eventName).toBe('click.created');
    expect(event).toBeInstanceOf(UrlRedirectedEvent);
    expect(event.urlId).toBe(url.id);
    expect(event.ipAddress).toBe(command.ipAddress);
    expect(event.userAgent).toBe(command.userAgent);
  });

  it('should throw UrlNotFoundError when cache has notFound marker', async () => {
    const command: RedirectUrlCommand = {
      shortCode: 'missing',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    };

    mockCacheManager.get.mockResolvedValue({ notFound: true });

    await expect(useCase.execute(command)).rejects.toThrow(UrlNotFoundError);

    expect(mockCacheManager.get).toHaveBeenCalledWith(
      URL_CACHE_KEY(command.shortCode),
    );
    expect(mockUrlRepository.findByShortCode).not.toHaveBeenCalled();
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should load from repository, cache the result and emit event when not cached', async () => {
    const url = makeUrl();
    const command: RedirectUrlCommand = {
      shortCode: url.shortCode.value,
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    };

    mockCacheManager.get.mockResolvedValue(null);
    mockUrlRepository.findByShortCode.mockResolvedValue(url);

    const result = await useCase.execute(command);

    expect(mockCacheManager.get).toHaveBeenCalledWith(
      URL_CACHE_KEY(command.shortCode),
    );
    expect(mockUrlRepository.findByShortCode).toHaveBeenCalledWith(
      command.shortCode,
    );

    expect(mockCacheManager.set).toHaveBeenCalledWith(
      URL_CACHE_KEY(url.shortCode.value),
      url.toPrimitives(),
      URL_CACHE_TTL_MS,
    );

    expect(result).toEqual({
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt,
      userId: url.userId,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    });

    expect(mockEventEmitter.emit).toHaveBeenCalledTimes(1);
  });

  it('should cache notFound marker and throw when URL not found in repository', async () => {
    const command: RedirectUrlCommand = {
      shortCode: 'missing',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    };

    mockCacheManager.get.mockResolvedValue(null);
    mockUrlRepository.findByShortCode.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UrlNotFoundError);

    expect(mockUrlRepository.findByShortCode).toHaveBeenCalledWith(
      command.shortCode,
    );
    expect(mockCacheManager.set).toHaveBeenCalledWith(
      URL_CACHE_KEY(command.shortCode),
      { notFound: true },
      URL_CACHE_NOT_FOUND_TTL_MS,
    );
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });

  it('should throw UrlExpiredError when URL is expired (from cache)', async () => {
    const now = new Date();
    const expiredUrl = makeUrl({
      expiresAt: new Date(now.getTime() - 60_000).toISOString(),
    });

    const command: RedirectUrlCommand = {
      shortCode: expiredUrl.shortCode.value,
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    };

    mockCacheManager.get.mockResolvedValue(expiredUrl.toPrimitives());

    await expect(useCase.execute(command)).rejects.toThrow(UrlExpiredError);

    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
    expect(mockUrlRepository.findByShortCode).not.toHaveBeenCalled();
  });

  it('should throw UrlExpiredError when URL is expired (from repository)', async () => {
    const now = new Date();
    const expiredUrl = new Url(
      'url-id',
      new UrlVO('https://example.com'),
      new ShortCodeVO('abc123'),
      new Date(now.getTime() - 60_000),
      'user-1',
      now,
      now,
      undefined,
    );

    const command: RedirectUrlCommand = {
      shortCode: expiredUrl.shortCode.value,
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
    };

    mockCacheManager.get.mockResolvedValue(null);
    mockUrlRepository.findByShortCode.mockResolvedValue(expiredUrl);

    await expect(useCase.execute(command)).rejects.toThrow(UrlExpiredError);

    expect(mockCacheManager.set).toHaveBeenCalledWith(
      URL_CACHE_KEY(expiredUrl.shortCode.value),
      expiredUrl.toPrimitives(),
      URL_CACHE_TTL_MS,
    );
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });
});
