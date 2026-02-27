import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CLICK_COUNT_CACHE_KEY } from 'src/modules/click/application/config/click-cache.config';
import { Url } from '../../domain/entities/url.entity';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';
import { URL_CACHE_KEY } from '../config/url-cache.config';
import { DeleteUrlCommand } from '../dtos/delete-url.command';
import { DeleteUrlUseCase } from './delete-url.use-case';

describe('DeleteUrlUseCase', () => {
  let useCase: DeleteUrlUseCase;

  type UrlRepositoryMock = {
    findById: jest.Mock<Promise<Url | null>, [string]>;
    delete: jest.Mock<Promise<void>, [string]>;
  };

  const mockUrlRepository: UrlRepositoryMock = {
    findById: jest.fn<Promise<Url | null>, [string]>(),
    delete: jest.fn<Promise<void>, [string]>(),
  };

  type CacheManagerMock = {
    del: jest.Mock<Promise<void>, [string]>;
  };

  const mockCacheManager: CacheManagerMock = {
    del: jest.fn<Promise<void>, [string]>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUrlUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    useCase = module.get<DeleteUrlUseCase>(DeleteUrlUseCase);
  });

  const makeUrl = (id: string): Url => {
    const now = new Date();
    return new Url(
      id,
      new UrlVO('https://example.com'),
      new ShortCodeVO('abc123'),
      undefined,
      'user-1',
      now,
      now,
      undefined,
    );
  };

  it('should delete URL and clear caches when URL exists', async () => {
    const url = makeUrl('url-id');
    const command: DeleteUrlCommand = {
      id: url.id!,
    };

    mockUrlRepository.findById.mockResolvedValue(url);

    await useCase.execute(command);

    expect(mockUrlRepository.findById).toHaveBeenCalledWith(command.id);
    expect(mockCacheManager.del).toHaveBeenCalledWith(
      URL_CACHE_KEY(url.shortCode.value),
    );
    expect(mockCacheManager.del).toHaveBeenCalledWith(
      CLICK_COUNT_CACHE_KEY(url.id!),
    );
    expect(mockUrlRepository.delete).toHaveBeenCalledWith(command.id);
  });

  it('should not clear click count cache when URL has no id', async () => {
    const now = new Date();
    const urlWithoutId = new Url(
      undefined,
      new UrlVO('https://example.com'),
      new ShortCodeVO('abc123'),
      undefined,
      'user-1',
      now,
      now,
      undefined,
    );

    const command: DeleteUrlCommand = {
      id: 'some-id',
    };

    mockUrlRepository.findById.mockResolvedValue(urlWithoutId);

    await useCase.execute(command);

    expect(mockUrlRepository.findById).toHaveBeenCalledWith(command.id);
    expect(mockCacheManager.del).toHaveBeenCalledTimes(1);
    expect(mockCacheManager.del).toHaveBeenCalledWith(
      URL_CACHE_KEY(urlWithoutId.shortCode.value),
    );
    expect(mockUrlRepository.delete).toHaveBeenCalledWith(command.id);
  });

  it('should throw UrlNotFoundError when URL does not exist', async () => {
    const command: DeleteUrlCommand = {
      id: 'missing-id',
    };

    mockUrlRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UrlNotFoundError);

    expect(mockUrlRepository.findById).toHaveBeenCalledWith(command.id);
    expect(mockCacheManager.del).not.toHaveBeenCalled();
    expect(mockUrlRepository.delete).not.toHaveBeenCalled();
  });
});
