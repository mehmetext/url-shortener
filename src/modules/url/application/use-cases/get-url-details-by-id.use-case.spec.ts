import { Test, TestingModule } from '@nestjs/testing';
import { GetClickCountUseCase } from 'src/modules/click/application/use-cases/get-click-count.use-case';
import { Url } from '../../domain/entities/url.entity';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';
import { GetUrlDetailsByIdCommand } from '../dtos/get-url-details-by-id.commands';
import { GetUrlDetailsByIdUseCase } from './get-url-details-by-id.use-case';

describe('GetUrlDetailsByIdUseCase', () => {
  let useCase: GetUrlDetailsByIdUseCase;

  type UrlRepositoryMock = {
    findById: jest.Mock<Promise<Url | null>, [string]>;
  };

  const mockUrlRepository: UrlRepositoryMock = {
    findById: jest.fn<Promise<Url | null>, [string]>(),
  };

  type GetClickCountUseCaseMock = {
    execute: jest.Mock<Promise<number>, [string]>;
  };

  const mockGetClickCountUseCase: GetClickCountUseCaseMock = {
    execute: jest.fn<Promise<number>, [string]>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUrlDetailsByIdUseCase,
        { provide: UrlRepository, useValue: mockUrlRepository },
        { provide: GetClickCountUseCase, useValue: mockGetClickCountUseCase },
      ],
    }).compile();

    useCase = module.get<GetUrlDetailsByIdUseCase>(GetUrlDetailsByIdUseCase);
  });

  const makeUrl = (overrides?: Partial<Url>): Url => {
    const now = new Date();
    return new Url(
      overrides?.id ?? 'url-id',
      overrides?.originalUrl ?? new UrlVO('https://example.com'),
      overrides?.shortCode ?? new ShortCodeVO('abc123'),
      overrides?.expiresAt,
      overrides?.userId,
      overrides?.createdAt ?? now,
      overrides?.updatedAt ?? now,
      overrides?.deletedAt,
    );
  };

  it('should return URL details with click count when URL exists', async () => {
    const url = makeUrl();
    const command: GetUrlDetailsByIdCommand = {
      id: url.id!,
    };

    mockUrlRepository.findById.mockResolvedValue(url);
    mockGetClickCountUseCase.execute.mockResolvedValue(5);

    const result = await useCase.execute(command);

    expect(mockUrlRepository.findById).toHaveBeenCalledWith(command.id);
    expect(mockGetClickCountUseCase.execute).toHaveBeenCalledWith(url.id);

    expect(result).toEqual({
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt ?? null,
      userId: url.userId ?? null,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      deletedAt: url.deletedAt ?? null,
      clicks: 5,
    });
  });

  it('should throw UrlNotFoundError when URL does not exist', async () => {
    const command: GetUrlDetailsByIdCommand = {
      id: 'missing-id',
    };

    mockUrlRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UrlNotFoundError);

    expect(mockUrlRepository.findById).toHaveBeenCalledWith(command.id);
    expect(mockGetClickCountUseCase.execute).not.toHaveBeenCalled();
  });
});
