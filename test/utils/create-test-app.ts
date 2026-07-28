import { config } from 'dotenv';
config();

import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app';
import { createUserToken } from '../../src/auth/logics/jwt.logic';

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

export const E2E_TEST_USER = {
  id: process.env.E2E_TEST_USER_ID ? +process.env.E2E_TEST_USER_ID : 8,
  name: process.env.E2E_TEST_USER_NAME || 'farid',
};

export async function getTestAuthHeader(
  user: { id: number; name: string } = E2E_TEST_USER,
): Promise<string> {
  const token = await createUserToken(user);
  return `Bearer ${token}`;
}
