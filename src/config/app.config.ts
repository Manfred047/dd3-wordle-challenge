import { registerAs } from '@nestjs/config';
import * as _ from 'lodash';
import { AppConfigInterface } from './interfaces/app.config.interface';

const AppConfig = registerAs('app', () => {
  const appData: AppConfigInterface = {
    environment: _.get(process, ['env', 'DD3_SERVICE_ENVIRONMENT'], null),
    host: _.get(process, ['env', 'DD3_SERVICE_HOST'], null),
    port: _.get(process, ['env', 'DD3_SERVICE_PORT'], null),
  };
  return appData;
});

export { AppConfig };
