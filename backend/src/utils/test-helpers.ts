import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { SignInDTO, SignUpDTO } from '@dto/auth';

export const makeSignUpRequest = async (
  app: INestApplication,
  { email, password, name }: SignUpDTO,
) => {
  const dto = new SignUpDTO();
  dto.email = email;
  dto.name = name;
  dto.password = password;

  return request(app.getHttpServer()).post('/api/sign-up').send(dto);
};

export const makeSignInRequest = async (
  app: INestApplication,
  { email, password }: SignInDTO,
) => {
  const dto = new SignInDTO();

  dto.email = email;
  dto.password = password;

  return request(app.getHttpServer()).post('/api/sign-in').send(dto);
};

export const makeSignOutRequest = async (
  app: INestApplication,
  cookies: string[],
) => {
  return (
    request(app.getHttpServer())
      // TODO should we be doing it like: session=eyJqd3QiOiJ...
      .post('/api/sign-out')
      .set('Cookie', cookies)
      .send()
  );
};

export const changeLastCharOfCookie = (cookie: string) => {
  // Grabbing AccessTokenCookie and changing last char of access token.
  const cookieOptions = cookie.split(';');
  const lastCharOfToken = cookieOptions[0].slice(-1);
  const _accessTokenChanged = cookieOptions[0]
    .slice(0, -1)
    .concat(lastCharOfToken === 'Z' ? 'Y' : 'Z');
  cookieOptions[0] = _accessTokenChanged;
  return cookieOptions.join(';');
};
