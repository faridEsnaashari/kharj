import { config } from 'dotenv';
config();

import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app';

export async function createTestApp(): Promise<NestExpressApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>({
    bufferLogs: true,
  });

  configureApp(app);

  await app.init();

  return app;
}

export const e2eTestUser = {
  owner: {
    name: process.env.E2E_TEST_USER_NAME ? process.env.E2E_TEST_USER_NAME : 'n',
    password: process.env.E2E_TEST_USER_PASSWORD
      ? process.env.E2E_TEST_USER_PASSWORD
      : 'n',
  },

  other: {
    name: process.env.E2E_TEST_OTHER_USER_NAME
      ? process.env.E2E_TEST_OTHER_USER_NAME
      : 'n',
    password: process.env.E2E_TEST_OTHER_USER_PASSWORD
      ? process.env.E2E_TEST_OTHER_USER_PASSWORD
      : 'n',
  },
};
