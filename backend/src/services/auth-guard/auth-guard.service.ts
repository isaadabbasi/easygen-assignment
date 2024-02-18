import { User } from '@models/user';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserRepository } from '@repositories/user';
import { AuthService } from '@services/auth/auth.service';
import { TOKENS, ACTIVE_SESSION_KEY } from '@utils/constants';
import { Exceptions } from '@utils/exceptions';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.cookies[TOKENS.TOKEN];

      if (!token) {
        this.logger.log('[AuthGuard] token not found in request');
        throw Exceptions.Unauthorised();
      }

      const { _id, email } = this.authService.decodeJwt<User>(token);
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        this.logger.log('[AuthGuard] user not found for token', _id);
        throw Exceptions.Unauthorised();
      }

      try {
        await this.authService.verifyToken(token, 'access');
      } catch (e) {
        this.logger.log('[AuthGuard] token unverifiable');
        throw Exceptions.Unauthorised();
      }

      request[ACTIVE_SESSION_KEY] = { _id, email: user.email };
      this.logger.log('[AuthGuard] token verified for user', _id);
      return true;
    } catch (error) {
      throw Exceptions.Unauthorised();
    }
  }
}
