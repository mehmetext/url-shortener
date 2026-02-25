import { Inject } from '@nestjs/common';
import { ClickRepository } from '../../domain/repositories/click.repository';

export class GetClickCountUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
  ) {}

  async execute(urlId: string): Promise<number> {
    return this.clickRepository.getCountByUrlId(urlId);
  }
}
