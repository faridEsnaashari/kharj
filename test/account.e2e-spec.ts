import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { makeAppReq } from './logics/request.logic';
import { createTestAccounts } from './logics/account.logic';

describe('Create Accounts', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Creates two accounts. one owned by user. one owned by other user', async () => {
    const { after } = await createTestAccounts(makeReq);
    await after();
  });
});
