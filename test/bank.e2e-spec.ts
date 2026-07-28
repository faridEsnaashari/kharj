import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { createTestApp, getTestAuthHeader } from './utils/create-test-app';

describe('BankController (e2e)', () => {
  let app: NestExpressApplication;
  let authHeader: string;

  beforeAll(async () => {
    app = await createTestApp();
    authHeader = await getTestAuthHeader();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /bank without a token is rejected by HasAccessGuard', async () => {
    await request(app.getHttpServer()).get('/bank').expect(403);
  });

  it('GET /bank with a valid token returns the general + own bank list', async () => {
    const response = await request(app.getHttpServer())
      .get('/bank')
      .set('Authorization', authHeader)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
