import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { makeAppReq } from './logics/request.logic';
import { createTestPayment } from './logics/payment.logic';

describe('Create Payments', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Creates a payment that pulls from another owner and records a debt', async () => {
    const { after } = await createTestPayment(makeReq);

    await after();
  });
});
