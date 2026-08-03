import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { makeAppReq } from './logics/request.logic';
import { createTestIncome } from './logics/income.logic';

describe('Create Incomes', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Creates some incomes for owner and other', async () => {
    const { after } = await createTestIncome(makeReq);

    await after();
  });
});
