import { Response } from 'express'
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common'
import { SignInDTO } from '@dto/auth'
import { UserRepository } from '@repositories/user'
import { Exceptions } from '@utils/exceptions'
import { CryptService } from '@services/crypt'
import { AuthService } from '@services/auth/auth.service'
import { Logger } from '@nestjs/common'

@Controller('api')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly cryptService: CryptService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async signIn(@Body() payload: SignInDTO, @Res() response: Response): Promise<any> {
    this.logger.log('[AuthController] attempt to signin', payload)

    const user = await this.userRepository.findByEmail(payload.email)
    this.logger.log('[AuthController:SignIn] signin failed: invalid email', payload)
    // IMP - Intentional, don't want to give exact information of invalid field
    if (!user) throw Exceptions.InvalidEmailOrPassword()

    const isEqual = await this.cryptService.compare(payload.password, user.password)
    this.logger.log('[AuthController:SignIn] signin failed: invalid password', payload)
    if (!isEqual) throw Exceptions.InvalidEmailOrPassword()
    
    let token = null
    try {
      token = await this.authService.signAccessToken(user)
    } catch(e) {
      this.logger.log('[AuthController:SignIn] sign token failed')
      response.status(500).send('Something went wrong')
    }

    response.cookie('token', token)
    response.send('OK')
  }

}
