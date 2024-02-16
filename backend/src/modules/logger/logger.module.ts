import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NODE_ENVS } from '@utils/constants'

import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {

        // may be you'd want 2kb or 4kb buffer or something for prod. KISS for now.
        const isDevelopmentMode = [NODE_ENVS.local, NODE_ENVS.dev].includes(
          config.get<string>('NODE_ENV').toLowerCase()
        )
        let transport;
        if (isDevelopmentMode) { // true all the time for NOW.
          transport = {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          }
        }

        return {
          pinoHttp: {
            transport,
          },
        };

      },
    }),
  ],
})

export class LoggerModule {}