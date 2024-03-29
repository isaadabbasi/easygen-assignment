import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDTO, SignUpDTO } from '@dto/auth';
import { UserRepository } from '@repositories/user';
import { Exceptions } from '@utils/exceptions';
import { CryptService } from '@services/crypt';
import { AuthService } from '@services/auth/auth.service';
import { Logger } from '@nestjs/common';
import { User } from '@models/user';
import { ACTIVE_SESSION_KEY, TOKENS } from '@utils/constants';
import { AuthGuard } from '@services/auth-guard';
import { ObjectId } from 'typeorm';

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
  async signIn(
    @Body() payload: SignInDTO,
    @Res() response: Response,
  ): Promise<void> {
    this.logger.log('[AuthController:SignIn] attempt to signin', payload);

    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      this.logger.log(
        '[AuthController:SignIn] signin failed: invalid email',
        payload,
      );
      // IMP - Intentional, don't want to give exact information of invalid field
      throw Exceptions.InvalidEmailOrPassword();
    }
    const isEqual = await this.cryptService.compare(
      payload.password,
      user.password,
    );
    if (!isEqual) {
      this.logger.log(
        '[AuthController:SignIn] signin failed: invalid password',
        payload,
      );
      throw Exceptions.InvalidEmailOrPassword();
    }
    await this.updateSessionTokens(user, response);

    this.logger.log('[AuthController:SignIn] successful');
    response.send(user._id);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() payload: SignUpDTO,
    @Res() response: Response,
  ): Promise<void> {
    this.logger.log('[AuthController:SignUp] attempt to signup', payload);

    const user = await this.userRepository.findByEmail(payload.email);
    if (user?._id) {
      throw Exceptions.UserAlreadyExists(
        `User with email address ${user.email} already exists`,
      );
    }
    const pHash = await this.cryptService.hash(payload.password);

    const newUser = await this.userRepository.saveUserWithHashedPwd(
      payload,
      pHash,
    );
    this.logger.log('[AuthController:SignUp] new user created', newUser._id);

    // IMP - We can add a task in the job queues to dispatch email-address verification email.
    // [Reason why jobQueue] , because we don't necessarily have to hold the request for that operation

    await this.updateSessionTokens(newUser, response);

    this.logger.log('[AuthController:SignUp] successful');
    response.send(newUser._id);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async signOut(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const { _id } = request[ACTIVE_SESSION_KEY];
    this.logger.log('[AuthController:SignOut] signout request by', _id);

    await this.removeSessionTokens(_id, response);

    this.logger.log('[AuthController:SignOut] signout sucessful');
    response.send();
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies[TOKENS.TOKEN];
    const sessionId = request.cookies[TOKENS.SESSION_ID];
    const { _id, email = '' } =
      this.authService.decodeJwt<Pick<User, '_id' | 'email'>>(token);
    this.logger.log(
      '[AuthController:RefreshToken] refresh token request by',
      _id,
    );
    const user = await this.userRepository.findOneBy({ email });

    if (!user?.refreshToken || user?.sessionId !== sessionId) {
      this.logger.log('[AuthController:RefreshToken] tweaked or invalid cookies');
      await this.removeSessionTokens(_id, response);
      throw Exceptions.Forbidden();
    }

    try {
      await this.authService.verifyToken(
        user.refreshToken,
        this.authService.getRefreshTokenOptions().secret.toString(),
      );
    } catch (e) {
      this.logger.log('[AuthController:RefreshToken] refresh token invalid');
      await this.removeSessionTokens(_id, response);
      throw Exceptions.Forbidden();
    }
    await this.updateSessionTokens(user, response);
    this.logger.log('[AuthController:RefreshToken] tokens refreshed');
    response.send();
  }

  @Get('/protected')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async protected(@Req() request: Request, @Res() response: Response) {
    const { email } = request[ACTIVE_SESSION_KEY];
    const user = await this.userRepository.findByEmail(email);
    const _user = this.userRepository.trimSecretFields(user);
    response.send(_user);
  }

  private async removeSessionTokens(
    _id: ObjectId,
    response: Response,
  ): Promise<void> {
    await this.userRepository.update(_id, {
      refreshToken: null,
      sessionId: null,
    });
    response.clearCookie(TOKENS.TOKEN);
    response.clearCookie(TOKENS.SESSION_ID);
  }

  private async updateSessionTokens(
    user: User,
    response: Response,
  ): Promise<void> {
    let token = null;
    let refreshToken = null;

    const sessionId = this.cryptService.genRandomB64String();
    const accessTokenOptions = this.authService.getAccessTokenOptions();
    accessTokenOptions.secret = sessionId;
    const refreshTokenOptions = this.authService.getRefreshTokenOptions();

    try {
      token = await this.authService.signToken(user, accessTokenOptions);
      refreshToken = await this.authService.signToken(
        user,
        refreshTokenOptions,
      );
    } catch (e) {
      // Extremely Rare chances that it will happen
      this.logger.log('[AuthController] sign tokens failed');
      throw Exceptions.InternalServerError();
    }

    await this.userRepository.update(user._id, { sessionId, refreshToken });
    this.logger.log('[AuthController] refresh token updated');
    const cookieOptions = this.authService.getCookieOptions();
    response.cookie(TOKENS.SESSION_ID, sessionId, cookieOptions);
    response.cookie(TOKENS.TOKEN, token, cookieOptions);
  }
}
