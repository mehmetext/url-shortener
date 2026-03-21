import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../../domain/repositories/token-generator.repository';
import { LoginUseCase } from './login.use-case';

const mockUser = new User(
  '1',
  new EmailVO('test@test.com'),
  'test',
  new Date(),
  new Date(),
  undefined,
);

const mockTokenGenerator: jest.Mocked<TokenGeneratorRepository> = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

const mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository> = {
  save: jest.fn(),
  findByUserIdAndJti: jest.fn(),
  delete: jest.fn(),
};

const mockConfigService: jest.Mocked<ConfigService> = {
  get: jest.fn(),
  getOrThrow: jest.fn(),
} as unknown as jest.Mocked<ConfigService>;

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTokenGenerator.generateToken
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    useCase = new LoginUseCase(
      mockTokenGenerator,
      mockConfigService,
      mockRefreshTokenRepository,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return login result with production token expiry', async () => {
      mockConfigService.get.mockReturnValueOnce('production');
      mockConfigService.getOrThrow.mockReturnValueOnce('accessTokenSecret');
      mockConfigService.getOrThrow.mockReturnValueOnce('refreshTokenSecret');

      const result = await useCase.execute(mockUser);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.expiresIn).toBe(15 * 60);
      expect(result.user.email).toBe('test@test.com');
    });

    it('should return login result with development token expiry', async () => {
      mockConfigService.get.mockReturnValueOnce('development');
      mockConfigService.getOrThrow.mockReturnValueOnce('accessTokenSecret');
      mockConfigService.getOrThrow.mockReturnValueOnce('refreshTokenSecret');

      const result = await useCase.execute(mockUser);

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.expiresIn).toBe(15 * 24 * 60 * 60);
      expect(result.user.email).toBe('test@test.com');
    });

    it('should save refresh token to repository', async () => {
      mockConfigService.get.mockReturnValueOnce('production');
      mockConfigService.getOrThrow.mockReturnValueOnce('accessTokenSecret');
      mockConfigService.getOrThrow.mockReturnValueOnce('refreshTokenSecret');

      await useCase.execute(mockUser);

      expect(mockRefreshTokenRepository.save.mock.calls[0]).toEqual([
        mockUser.id,
        expect.any(String),
        'refresh-token',
        7 * 24 * 60 * 60,
      ]);
    });

    it('should generate access token with correct options', async () => {
      mockConfigService.get.mockReturnValue('production');
      mockConfigService.getOrThrow.mockReturnValueOnce('accessTokenSecret');
      mockConfigService.getOrThrow.mockReturnValueOnce('refreshTokenSecret');

      await useCase.execute(mockUser);

      expect(mockTokenGenerator.generateToken.mock.calls[0]).toEqual([
        { sub: mockUser.id, jti: expect.any(String) as string },
        { expiresIn: '15m', secret: 'accessTokenSecret' },
      ]);
      expect(mockTokenGenerator.generateToken.mock.calls[1]).toEqual([
        { sub: mockUser.id, jti: expect.any(String) as string },
        { expiresIn: '7d', secret: 'refreshTokenSecret' },
      ]);
    });
  });
});
