import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { makeAppReq } from './logics/request.logic';
import { createTestExchange } from './logics/exchange.logic';

describe('Create Exchanges', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Moves funds between two of the owner accounts', async () => {
    const { after } = await createTestExchange(makeReq);

    await after();
  });
});
