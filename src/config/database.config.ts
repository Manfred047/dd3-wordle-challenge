import { registerAs } from '@nestjs/config';
import * as _ from 'lodash';
import { DatabaseConfigInterface } from './interfaces/database.config.interface';

const DatabaseConfig = registerAs('database', () => {
  const databaseData: DatabaseConfigInterface = {
    type: _.get(process, ['env', 'DB_TYPE'], null),
    host: _.get(process, ['env', 'DB_HOST'], null),
    port: _.get(process, ['env', 'DB_PORT'], null),
    username: _.get(process, ['env', 'DB_USERNAME'], null),
    password: _.get(process, ['env', 'DB_PASSWORD'], null),
    database: _.get(process, ['env', 'DB_NAME'], null),
  };
  return databaseData;
});

export { DatabaseConfig };
