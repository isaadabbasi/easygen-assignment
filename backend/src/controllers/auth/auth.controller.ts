import { Request, Response } from 'express'
import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { SignInDTO, SignUpDTO } from '@dto/auth'
import { UserRepository } from '@repositories/user'
import { Exceptions } from '@utils/exceptions'
import { CryptService } from '@services/crypt'
import { AuthService } from '@services/auth/auth.service'
import { Logger } from '@nestjs/common'
import { User } from '@models/user'
import { ACTIVE_SESSION_KEY, TOKENS } from '@utils/constants'
import { AuthGuard } from '@services/auth-guard'

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
  async signIn(@Body() payload: SignInDTO, @Res() response: Response): Promise<void> {
    this.logger.log('[AuthController:SignIn] attempt to signin', payload)

    const user = await this.userRepository.findByEmail(payload.email)
    if (!user) {
      this.logger.log('[AuthController:SignIn] signin failed: invalid email', payload)
      // IMP - Intentional, don't want to give exact information of invalid field
      throw Exceptions.InvalidEmailOrPassword()
    }
    const isEqual = await this.cryptService.compare(payload.password, user.password)
    if (!isEqual) {
      this.logger.log('[AuthController:SignIn] signin failed: invalid password', payload)
      throw Exceptions.InvalidEmailOrPassword()
    }
    await this.updateSessionTokens(user, response)

    this.logger.log('[AuthController:SignIn] successful')
    response.send('Ok')
  }


  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async signUp(@Body() payload: SignUpDTO, @Res() response: Response): Promise<void> {
    this.logger.log('[AuthController:SignUp] attempt to signup', payload)
    
    const user = await this.userRepository.findByEmail(payload.email)
    if (user?._id) {
      throw Exceptions.UserAlreadyExists(`User with email address ${user.email} already exists`)
    }
    const pHash = await this.cryptService.hash(payload.password)
    
    const newUser = await this.userRepository.saveUserWithHashedPwd(payload, pHash)
    this.logger.log('[AuthController:SignUp] new user created', newUser._id)

    // IMP - We can add a task in the job queues to dispatch email-address verification email.
    // [Reason why jobQueue] , because we don't necessarily have to hold the request for that operation

    await this.updateSessionTokens(newUser, response)

    this.logger.log('[AuthController:SignUp] successful')
    response.send('Created')
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async signOut(request: Request, response: Response): Promise<void> {
    const { _id } = request[ACTIVE_SESSION_KEY]
    if (_id) {
      await this.userRepository.update(_id, { refreshToken: null })
    }
    response.clearCookie(TOKENS.TOKEN)
    response.clearCookie(TOKENS.REFRESH_TOKEN)
    response.send('Ok')
  }

  private async updateSessionTokens(user: User, response: Response): Promise<void> {
    let token = null
    let refreshToken = null
    try {
      token = await this.authService.signToken(user, 'access')
      refreshToken = await this.authService.signToken(user, 'refresh')
    } catch(e) {
      // Extremely Rare chances that it will happen
      this.logger.log('[AuthController] sign token failed')
      throw Exceptions.InternalServerError()
    }

    await this.userRepository.update(user._id, { refreshToken })
    this.logger.log('[AuthController] refresh token updated')
    const cookieOptions = this.authService.getCookieOptions()
    response.cookie(TOKENS.TOKEN, token, cookieOptions)
  }

}
