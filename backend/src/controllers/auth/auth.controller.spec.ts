import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { ConfigModule } from '@nestjs/config';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from '@services/auth';
import { CryptService } from '@services/crypt';
import { User } from '@models/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@repositories/user';
import { DataSource } from 'typeorm';
import { AuthGuard } from '@services/auth-guard';

import {
  makeSignInRequest,
  makeSignOutRequest,
  makeSignUpRequest,
  changeLastCharOfCookie,
} from '@utils/test-helpers';

describe('AuthController', () => {
  let mongod: MongoMemoryServer;
  let app: INestApplication;
  let moduleRef: TestingModule;
  let datasource: DataSource;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([UserRepository]),
        ConfigModule.forRoot({ isGlobal: true, envFilePath: `sample.env` }),
        TypeOrmModule.forRoot({
          type: 'mongodb',
          entities: [User],
          url: uri,
        }),
      ],
      controllers: [AuthController],
      providers: [
        JwtService,
        CryptService,
        AuthService,
        UserRepository,
        AuthGuard,
      ],
    }).compile();

    datasource = moduleRef.get(DataSource);

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await datasource.dropDatabase();
    await datasource.destroy();
    await mongod.stop();
  });

  afterEach(async () => {
    await datasource.dropDatabase();
  });

  describe('[SignUp]', () => {
    it.each`
      email                   | password        | message
      -----------------------                                          | ---------------- | ------------------------------------------------------
      ${''}                   | ${'Password1#'} | ${'email should not be empty'}
      ${'invalidEmail'}       | ${'Password1#'} | ${'email must be an email'}
      ${'test'}               | ${'Password1#'} | ${'email must be an email'}
      ${'myac.com'}           | ${'Password1#'} | ${'email must be an email'}
      ${'myac@mail'}          | ${'Password1#'} | ${'email must be an email'}
      ${'myaccount@mail.com'} | ${'short'}      | ${'password must be longer than or equal to 8 characters'}
      ${'myaccount@mail.com'} | ${'testpass'}   | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'12345678'}   | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'!@#$%^&*'}   | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'987654'}     | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'abcdef'}     | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'12345'}      | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'!@#$%'}      | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'99111999'}   | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'87654321'}   | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'1234'}       | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'!@#Abc'}     | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'123Abc'}     | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'@#$123'}     | ${'Password must contain atleast 1 special character, 1 letter and a number'}
      ${'myaccount@mail.com'} | ${'#1Aa'}       | ${'password must be longer than or equal to 8 characters'}
      ${'myaccount@mail.com'} | ${'_#Aa12.'}    | ${'password must be longer than or equal to 8 characters'}
      ${'myaccount@mail.com'} | ${'123@123'}    | ${'password must be longer than or equal to 8 characters'}
      ${'myaccount@mail.com'} | ${'#33A123'}    | ${'password must be longer than or equal to 8 characters'}
      ${'myaccount@mail.com'} | ${'123'}        | ${'password must be longer than or equal to 8 characters'}
      ${'myaccount@mail.com'} | ${''}           | ${'password must be longer than or equal to 8 characters'}
    `(
      'should throw error ("$message") if email ("$email") or password ("$password") is invalid',
      async ({ email, password, message }) => {
        const response = await makeSignUpRequest(app, {
          email,
          password,
          name: 'John Doe',
        });
        expect(response.body.message).toContain(message);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
    );

    it('should throw error if name is empty string', async () => {
      const response = await makeSignUpRequest(app, {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
        name: '',
      });
      expect(response.body.message).toContain('name should not be empty');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should throw error if "name" is a number ', async () => {
      const response = await makeSignUpRequest(app, {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
        name: 1 as any,
      });
      expect(response.body.message).toContain('name must be a string');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should sucessfully signup on valid payload', async () => {
      const response = await makeSignUpRequest(app, {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
        name: 'John Doe',
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should have a access-token on successful signup', async () => {
      const response = await makeSignUpRequest(app, {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
        name: 'John Doe',
      });
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('[SignIn]', () => {
    it.each`
      email              | password        | message
    ------------------------ | ----------------- | ------------------------------------------------------
      ${''}              | ${'Password1#'} | ${'email should not be empty'}
      ${'invalidEmail'}  | ${'Password1#'} | ${'email must be an email'}
      ${'myac'}          | ${'Password1#'} | ${'email must be an email'}
      ${'myac.com'}      | ${'Password1#'} | ${'email must be an email'}
      ${'myac@mail'}     | ${'Password1#'} | ${'email must be an email'}
      ${'myac@mail.com'} | ${''}           | ${'password should not be empty'}
    `(
      'should throw error ("$message") if email ("$email") or password ("$password") is invalid',
      async ({ email, password, message }) => {
        const response = await makeSignInRequest(app, {
          email,
          password,
        });
        expect(response.body.message).toContain(message);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      },
    );

    it('should throw error if "password" is a number', async () => {
      const response = await makeSignInRequest(app, {
        email: 'myaccount@mail.com',
        password: 123 as any,
      });
      expect(response.body.message).toContain('password must be a string');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should sucessfully signin on valid payload', async () => {
      const credentials = {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
      };
      await makeSignUpRequest(app, {
        ...credentials,
        name: 'John Doe',
      });
      const response = await makeSignInRequest(app, credentials);
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should have access-token on successful signin', async () => {
      const credentials = {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
      };
      await makeSignUpRequest(app, {
        ...credentials,
        name: 'John Doe',
      });
      const response = await makeSignInRequest(app, credentials);
      const cookies = response.headers['set-cookie'] as unknown as string[];

      expect(cookies.some((cookie) => cookie.includes('TOKEN=')));
    });
  });

  describe('SignOut', () => {
    it('should throw error if no token sent', async () => {
      const response = await makeSignOutRequest(app, []);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should throw error if invalid/tempered token sent', async () => {
      const credentials = {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
      };
      const signUpResponse = await makeSignUpRequest(app, {
        ...credentials,
        name: 'John Doe',
      });

      const cookies = signUpResponse.headers[
        'set-cookie'
      ] as unknown as string[];

      const changedAccessTokenCookie = changeLastCharOfCookie(cookies[1]);

      const signOutResponse = await makeSignOutRequest(app, [
        cookies[0],
        changedAccessTokenCookie,
      ]);
      expect(signOutResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should signout if access token cookie is valid', async () => {
      const credentials = {
        email: 'myaccount@mail.com',
        password: 'Abcd1234#',
      };
      const signUpResponse = await makeSignUpRequest(app, {
        ...credentials,
        name: 'John Doe',
      });

      const cookies = signUpResponse.headers[
        'set-cookie'
      ] as unknown as string[];

      const signOutResponse = await makeSignOutRequest(app, cookies);
      expect(signOutResponse.status).toBe(HttpStatus.OK);
    });
  });

  // NOTE:
  /**
   * Same as that we can further extend this to check refreshToken, and protected route usecases
   * For now we are using unit tests, we can also do stateful and state-less fuzz tests
   * SKIPPING MORE TESTS FOR NOW.
   */
});
