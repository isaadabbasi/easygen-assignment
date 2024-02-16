import { User } from '@models/user'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  signAccessToken(user: User): Promise<string> {
    const { _id: subject, ..._user } = user
    return this.jwtService.signAsync({
      subject,
      ..._user,
    }, {
      // IMPORTANT NOTES - 
      algorithm: 'HS256', // Symmetric key encryption algorithm
      // We should be using a asymetric-key encryption 'RS256' | 'RS512' but for that -
      // we will have to use a key-management service (KMS) as we can not have a private and public file as a state on machine
      // we must keep our api-servers stataless. so, for a test, it might be a showoff of skills. 
      // But wanted to let the team know. BEST PRACTICE CONSIDERED & FOLLOWED.
      // algorithm: 'RS256' | 'RS512'
      secret: this.configService.getOrThrow('JWT_SECRET'),
      issuer: this.configService.getOrThrow('JWT_ISSUER'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRESIN'),
      audience: this.configService.get('JWT_AUDIENCE') || '*',
      subject: 'authentication',
    })
  }
}