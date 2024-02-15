import { Module } from '@nestjs/common';
import { ConfigModule as NestJSConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestJSConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
  ],
})
export class ConfigModule {}