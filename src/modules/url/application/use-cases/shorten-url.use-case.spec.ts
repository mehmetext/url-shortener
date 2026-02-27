import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { Url } from '../../domain/entities/url.entity';
import { ShortCodeGenerationFailedError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';
import { ShortenUrlCommand } from '../dtos/shorten-url.command';
import { ShortenUrlUseCase } from './shorten-url.use-case';

describe('ShortenUrlUseCase', () => {
  let useCase: ShortenUrlUseCase;

  // Mock Repository ve Cache
  const mockUrlRepository = {
    create: jest.fn(),
    findByShortCode: jest.fn(),
  };

  const mockCacheManager = {
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenUrlUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    useCase = module.get<ShortenUrlUseCase>(ShortenUrlUseCase);
  });

  it('should successfully shorten a URL', async () => {
    // GIVEN (Hazırlık)
    const command: ShortenUrlCommand = {
      originalUrl: new UrlVO('https://google.com'),
      userId: 'user-123',
    };

    mockUrlRepository.findByShortCode.mockResolvedValue(null); // Çakışma yok
    mockUrlRepository.create.mockImplementation((url) => Promise.resolve(url));

    // WHEN (Eylem)
    const result = await useCase.execute(command);

    // THEN (Kontrol)
    expect(result).toBeDefined();
    expect(result.originalUrl).toBe(command.originalUrl.value);
    expect(mockUrlRepository.create).toHaveBeenCalled();
    expect(mockCacheManager.set).toHaveBeenCalled();
  });

  it('should retry if a short code collision occurs', async () => {
    // GIVEN
    const command: ShortenUrlCommand = {
      originalUrl: new UrlVO('https://google.com'),
    };

    // İlk denemede çakışma (bulunmuş), ikinci denemede boş dönsün (başarılı)
    mockUrlRepository.findByShortCode
      .mockResolvedValueOnce(
        new Url(
          undefined,
          new UrlVO('https://old.com'),
          new ShortCodeVO('abc123'),
          undefined,
          undefined,
          new Date(),
          new Date(),
          undefined,
        ),
      )
      .mockResolvedValueOnce(null);

    mockUrlRepository.create.mockImplementation((url) => Promise.resolve(url));

    // WHEN
    await useCase.execute(command);

    // THEN
    expect(mockUrlRepository.findByShortCode).toHaveBeenCalledTimes(2);
  });

  it('should throw ShortCodeGenerationFailedError if it cannot generate a unique code after 3 tries', async () => {
    // GIVEN
    const command: ShortenUrlCommand = {
      originalUrl: new UrlVO('https://google.com'),
    };

    const mockExistingUrl = new Url(
      'some-id',
      new UrlVO('https://old.com'),
      new ShortCodeVO('abc123'),
      undefined,
      undefined,
      new Date(),
      new Date(),
      undefined,
    );
    mockUrlRepository.findByShortCode.mockResolvedValue(mockExistingUrl);

    // WHEN & THEN
    await expect(useCase.execute(command)).rejects.toThrow(
      ShortCodeGenerationFailedError,
    );

    expect(mockUrlRepository.findByShortCode).toHaveBeenCalledTimes(3);
    expect(mockUrlRepository.create).not.toHaveBeenCalled();
  });
});
