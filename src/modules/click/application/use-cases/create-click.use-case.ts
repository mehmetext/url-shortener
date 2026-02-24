import { Inject, Injectable } from '@nestjs/common';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { CreateClickCommand } from '../dtos/create-click.command';

@Injectable()
export class CreateClickUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
  ) {}

  async execute(command: CreateClickCommand): Promise<Click> {
    return this.clickRepository.create(command);
  }
}
