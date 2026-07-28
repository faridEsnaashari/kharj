import { config } from 'dotenv';
config();

import { appConfigs } from './app.configs';
import { Logger as L } from './common/tools/pino/logger.tool';
import { createApp } from './app';
//import { resolve } from 'path';

export async function bootstrap() {
  const app = await createApp();

  const logger = new L('bootstrap');
  await app.listen(appConfigs.appPort, () =>
    logger.log({
      key: 'MAIN',
      data: { msg: 'app started on port ' + appConfigs.appPort },
    }),
  );
  return;
}
bootstrap();
