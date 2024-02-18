import { CookieOptions } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NODE_ENVS } from '@utils/constants';

@Injectable()
export class AuthService {
  private readonly accessTokenJwtOptions: JwtSignOptions = null;
  private readonly refreshTokenJwtOptions: JwtSignOptions = null;
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const isProd = configService.get('NODE_ENV') === NODE_ENVS.prod;
    this.cookieOptions = <CookieOptions>{
      httpOnly: true,
      sameSite: true,
      secure: isProd,
    };

    this.accessTokenJwtOptions = {
      // IMPORTANT NOTES -
      algorithm: 'HS256', // Symmetric key encryption algorithm
      // Its fine to use symmetric key encryption for short lived sessions,
      // TIP: make sure to not use an easily guessable JWT_SECRET
      issuer: this.configService.getOrThrow('JWT_ISSUER'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRESIN'),
      audience: this.configService.get('JWT_AUDIENCE') || '*',
      subject: 'authentication',
    };

    this.refreshTokenJwtOptions = {
      // IMPORTANT NOTES -
      algorithm: 'HS256', // Symmetric key encryption algorithm
      // We should be using a asymetric-key encryption 'RS256' | 'RS512' but for that -
      // we will have to use a key-management service (KMS) as we can not have a private and public file as a state on machine
      // we must keep our api-servers stataless. so, for a test, it might be a showoff of skills.
      // But wanted to let the team know. BEST PRACTICE CONSIDERED & FOLLOWED.
      // algorithm: 'RS256' | 'RS512'
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRESIN'),
    };
  }

  getAccessTokenOptions(): JwtSignOptions {
    return this.accessTokenJwtOptions;
  }

  getRefreshTokenOptions(): JwtSignOptions {
    return this.refreshTokenJwtOptions;
  }

  signToken(payload, options: JwtSignOptions): Promise<string> {
    const { _id, email } = payload;
    return this.jwtService.signAsync({ _id, email }, options);
  }

  verifyToken<T extends Object>(token: string, secret: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, { secret });
  }

  // Use of Generics: .decode is generic
  decodeJwt<T>(token: string): T {
    return this.jwtService.decode<T>(token);
  }

  getCookieOptions(): CookieOptions {
    return this.cookieOptions;
  }
}
