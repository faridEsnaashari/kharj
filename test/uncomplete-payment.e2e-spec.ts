import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { makeAppReq } from './logics/request.logic';
import { createTestUncompletePayment } from './logics/uncomplete-payment.logic';

describe('Create Uncomplete Payments', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Parses an SMS import and converts it into a payment that records a debt', async () => {
    const { after } = await createTestUncompletePayment(makeReq);

    await after();
  });
});
