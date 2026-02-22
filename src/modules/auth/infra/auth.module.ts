import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/infra/user.module';
import { AuthController } from './http/auth.controller';

@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [],
})
export class AuthModule {}
