import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { NODE_ENVS } from './utils/constants'

import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT;
  const origin = process.env.REQUEST_ORIGIN;

  app.enableCors({ credentials: true, origin });

  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
