import { Test, TestingModule } from '@nestjs/testing';
import { Url } from '../../domain/entities/url.entity';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';
import { GetAllShortenedUrlsCommand } from '../dtos/get-all-shortened-urls.command';
import { GetAllShortenedUrlsUseCase } from './get-all-shortened-urls.use-case';

describe('GetAllShortenedUrlsUseCase', () => {
  let useCase: GetAllShortenedUrlsUseCase;

  type UrlRepositoryMock = {
    findAllByUserId: jest.Mock<Promise<Url[]>, [string]>;
  };

  const mockUrlRepository: UrlRepositoryMock = {
    findAllByUserId: jest.fn<Promise<Url[]>, [string]>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllShortenedUrlsUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
      ],
    }).compile();

    useCase = module.get<GetAllShortenedUrlsUseCase>(
      GetAllShortenedUrlsUseCase,
    );
  });

  const makeUrl = (id: string, userId: string): Url => {
    const now = new Date();
    return new Url(
      id,
      new UrlVO('https://example.com/' + id),
      new ShortCodeVO('code' + id),
      undefined,
      userId,
      now,
      now,
      undefined,
    );
  };

  it('should return all shortened URLs for a user', async () => {
    const userId = 'user-1';
    const urls = [makeUrl('1', userId), makeUrl('2', userId)];

    const command: GetAllShortenedUrlsCommand = {
      userId,
    };

    mockUrlRepository.findAllByUserId.mockResolvedValue(urls);

    const result = await useCase.execute(command);

    expect(mockUrlRepository.findAllByUserId).toHaveBeenCalledWith(userId);

    expect(result).toEqual([
      {
        id: urls[0].id!,
        originalUrl: urls[0].originalUrl.value,
        shortCode: urls[0].shortCode.value,
        expiresAt: urls[0].expiresAt,
        userId: urls[0].userId,
        createdAt: urls[0].createdAt,
        updatedAt: urls[0].updatedAt,
      },
      {
        id: urls[1].id!,
        originalUrl: urls[1].originalUrl.value,
        shortCode: urls[1].shortCode.value,
        expiresAt: urls[1].expiresAt,
        userId: urls[1].userId,
        createdAt: urls[1].createdAt,
        updatedAt: urls[1].updatedAt,
      },
    ]);
  });

  it('should return an empty array when user has no URLs', async () => {
    const userId = 'user-empty';
    const command: GetAllShortenedUrlsCommand = {
      userId,
    };

    mockUrlRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute(command);

    expect(mockUrlRepository.findAllByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual([]);
  });
});
