import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerModule } from '@modules/logger';
import { ConfigModule } from '@modules/config'
import { DatabaseModule } from '@database/index'

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
