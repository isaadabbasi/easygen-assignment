import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from '@services/auth'
import { CryptService } from '@services/crypt'
import { AuthController } from '@controllers/auth'
import { UserRepository } from '@repositories/user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@models/user'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, CryptService, UserRepository, JwtService],
})
export class AuthModule {}
