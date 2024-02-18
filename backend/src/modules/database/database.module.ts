import { ConfigModule } from '@modules/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@models/user';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { NODE_ENVS } from '@utils/constants';

// Rather than wrapping a module in shallow @Module (making "PointFree Module")
// Let's export the config directly
export const DatabaseModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const isDevelopmentMode = [
      NODE_ENVS.local,
      NODE_ENVS.dev,
      NODE_ENVS.staging,
    ].includes(configService.get<string>('NODE_ENV').toLowerCase());
    // IMP - For production or staging you'd probably wanna use credentials. we can tune it here
    // it will be - url: mongodb://user:password@mongo:27017/; no need for host/port then
    if (isDevelopmentMode) {
      return {
        type: 'mongodb',
        database: configService.get('DB_APP') || 'app',
        host: configService.get('DB_HOST') || 'localhost',
        port: Number.parseInt(configService.get('DB_PORT')) || 27017,
        entities: [User],
        synchronize: false,
      } as MongoConnectionOptions;
    }
  },
});
