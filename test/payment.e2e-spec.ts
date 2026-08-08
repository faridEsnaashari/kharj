import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { createTestAccount } from './logics/account.logic';
import { createTestIncome } from './logics/income.logic';
import { createTestPayment } from './logics/payment.logic';
import { signinTestUsers } from './logics/auth/signin.logic';
import { makeAppReq } from './utils/request.logic';
import { IncomeCategory } from 'src/income/enums/income-category.enum';
import { PaymentCategory } from 'src/payment/enums/payment-category.enum';

describe('Create Payments', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;
  let accountTest: ReturnType<typeof createTestAccount>;
  let incomeTest: ReturnType<typeof createTestIncome>;
  let paymentTest: ReturnType<typeof createTestPayment>;

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
    paymentTest = createTestPayment(makeReq);
  });

  afterEach(async () => {
    await paymentTest.after();
    await incomeTest.after();
    await accountTest.after();
  });

  it('Creates a payment that pulls from another owner and records a debt', async () => {
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
          account: otherAccount.data,
          amount: 500,
          category: IncomeCategory.HOGHOOGH,
          paidAt: '2026-07-30 05:57:00',
          description: 'funding for payment e2e',
        },
      ],
    });

    await paymentTest.test({
      users,
      debitedAccount: otherAccount.data,
      creditedAccount: ownerAccount.data,
      payment: {
        price: 200,
        bankId: ownerAccount.data.bankId,
        unitId: ownerAccount.data.unitId,
        ownerId: ownerAccount.data.ownedBy,
        category: PaymentCategory.FOOD,
        isFun: false,
        isMaman: false,
        paidAt: '2026-07-30 06:00:00',
        description: 'payment e2e',
      },
    });
  });

  it('Creates a payment for the owner itself, drawn from their own funded account, with no debt', async () => {
    const userTest = await signinTestUsers(makeReq);
    const users = await userTest.test();

    const [selfAccount] = await accountTest.test({
      users,
      accounts: [
        {
          ownedBy: users.relations.data[0].id,
          userId: users.relations.data[0].id,
          ballance: 0,
          priority: 0,
          bank: { symbol: 'SEPAH' },
          unit: { symbol: 'RIAL' },
        },
      ],
    });

    await incomeTest.test({
      users,
      incomes: [
        {
          account: selfAccount.data,
          amount: 500,
          category: IncomeCategory.HOGHOOGH,
          paidAt: '2026-07-30 05:57:00',
          description: 'funding for self payment e2e',
        },
      ],
    });

    await paymentTest.test({
      users,
      debitedAccount: selfAccount.data,
      payment: {
        price: 200,
        bankId: selfAccount.data.bankId,
        unitId: selfAccount.data.unitId,
        ownerId: selfAccount.data.ownedBy,
        category: PaymentCategory.FOOD,
        isFun: false,
        isMaman: false,
        paidAt: '2026-07-30 06:00:00',
        description: 'self payment e2e',
      },
    });
  });

  it('Creates a payment for a related user whose own account covers it, with no debt', async () => {
    const userTest = await signinTestUsers(makeReq);
    const users = await userTest.test();

    const [relatedAccount] = await accountTest.test({
      users,
      accounts: [
        {
          ownedBy: users.relations.data[1].id,
          userId: users.relations.data[0].id,
          ballance: 0,
          priority: 0,
          bank: { symbol: 'MELY' },
          unit: { symbol: 'RIAL' },
        },
      ],
    });

    await incomeTest.test({
      users,
      incomes: [
        {
          account: relatedAccount.data,
          amount: 500,
          category: IncomeCategory.HOGHOOGH,
          paidAt: '2026-07-30 05:57:00',
          description: 'funding for related-user payment e2e',
        },
      ],
    });

    await paymentTest.test({
      users,
      debitedAccount: relatedAccount.data,
      payment: {
        price: 200,
        bankId: relatedAccount.data.bankId,
        unitId: relatedAccount.data.unitId,
        ownerId: relatedAccount.data.ownedBy,
        category: PaymentCategory.FOOD,
        isFun: false,
        isMaman: false,
        paidAt: '2026-07-30 06:00:00',
        description: 'related-user payment e2e',
      },
    });
  });
});
