import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { createTestAccount } from './logics/account.logic';
import { signinTestUsers } from './logics/auth/signin.logic';
import { makeAppReq } from './utils/request.logic';

describe('Create Accounts', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;
  let accountTest: ReturnType<typeof createTestAccount>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    accountTest = createTestAccount(makeReq);
  });

  afterEach(async () => {
    await accountTest.after();
  });

  it('Creates two accounts. one owned by user. one owned by other user', async () => {
    const userTest = await signinTestUsers(makeReq);
    const users = await userTest.test();

    await accountTest.test({
      users,
      accounts: [
        {
          ownedBy: users.relations.data[0].id,
          userId: users.relations.data[0].id,
          ballance: 0,
          priority: 0,
          bank: { symbol: 'RESALAT' },
          unit: { symbol: 'RIAL' },
        },
        {
          ownedBy: users.relations.data[1].id,
          userId: users.relations.data[0].id,
          ballance: 0,
          priority: 0,
          bank: { symbol: 'RESALAT' },
          unit: { symbol: 'RIAL' },
        },
      ],
    });
  });
});
