import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AuthModule } from '@modules/auth';
import { LoggerModule } from '@modules/logger';
import { ConfigModule } from '@modules/config';
import { DatabaseModule } from '@modules/database';

@Module({
  imports: [ConfigModule, LoggerModule, DatabaseModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
