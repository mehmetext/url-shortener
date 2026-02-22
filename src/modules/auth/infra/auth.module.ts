import { Module } from '@nestjs/common';
import { AuthController } from './http/auth.controller';

@Module({
  controllers: [AuthController],
  imports: [],
  providers: [],
})
export class AuthModule {}
