import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { createTestAccount } from './logics/account.logic';
import { createTestIncome } from './logics/income.logic';
import { createTestExchange } from './logics/exchange.logic';
import { signinTestUsers } from './logics/auth/signin.logic';
import { makeAppReq } from './utils/request.logic';
import { IncomeCategory } from 'src/income/enums/income-category.enum';

describe('Create Exchanges', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;
  let accountTest: ReturnType<typeof createTestAccount>;
  let incomeTest: ReturnType<typeof createTestIncome>;
  let exchangeTest: ReturnType<typeof createTestExchange>;

  beforeAll(async () => {
    app = await createTestApp();
    makeReq = makeAppReq(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    accountTest = createTestAccount(makeReq);
    incomeTest = createTestIncome(makeReq);
    exchangeTest = createTestExchange(makeReq);
  });

  afterEach(async () => {
    await exchangeTest.after();
    await incomeTest.after();
    await accountTest.after();
  });

  it('Moves funds between two of the owner accounts', async () => {
    const userTest = await signinTestUsers(makeReq);
    const users = await userTest.test();

    const [ownerAccount, otherAccount] = await accountTest.test({
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
          priority: 1,
          bank: { symbol: 'RESALAT' },
          unit: { symbol: 'RIAL' },
        },
      ],
    });

    await incomeTest.test({
      users,
      incomes: [
        {
          account: ownerAccount.data,
          amount: 500,
          category: IncomeCategory.HOGHOOGH,
          paidAt: '2026-07-30 05:57:00',
          description: 'funding for exchange e2e',
        },
      ],
    });

    await exchangeTest.test({
      users,
      fromAccount: ownerAccount.data,
      toAccount: otherAccount.data,
      exchange: {
        fromAccountId: ownerAccount.data.id,
        toAccountId: otherAccount.data.id,
        toUser: ownerAccount.data.ownedBy,
        fromAmount: 100,
        toAmount: 90,
        paidAt: '2026-07-30 06:00:00',
      },
    });
  });
});
