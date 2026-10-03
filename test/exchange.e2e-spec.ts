import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { createTestAccount } from './logics/account.logic';
import { createTestIncome } from './logics/income.logic';
import { createTestExchange } from './logics/exchange.logic';
import { signinTestUsers } from './logics/auth/signin.logic';
import { makeAppReq } from './utils/request.logic';
import { createTestUncompletePayment } from './logics/uncomplete-payment.logic';
import { Paginated } from 'src/common/types/pagination.type';
import { UncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';
import { IncomeCategory } from 'src/income/enums/income-category.enum';

const RESALAT_SMS_TEXT = [
  '1234567890',
  '-1500000',
  '01/15_10:30',
  'مانده: 800000',
].join('\n');

const LARGE_AMOUNT = 51043170;

describe('Create Exchanges', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;
  let accountTest: ReturnType<typeof createTestAccount>;
  let incomeTest: ReturnType<typeof createTestIncome>;
  let exchangeTest: ReturnType<typeof createTestExchange>;
  let uncompletePaymentTest: ReturnType<typeof createTestUncompletePayment>;

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
    uncompletePaymentTest = createTestUncompletePayment(makeReq);
  });

  afterEach(async () => {
    await exchangeTest.after();
    await uncompletePaymentTest.after();
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

  it('Converts a pending import into an exchange and removes it from the inbox', async () => {
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
          description: 'funding for exchange-from-inbox e2e',
        },
      ],
    });

    const pending = await uncompletePaymentTest.test({
      users,
      bankId: ownerAccount.data.bankId,
      text: RESALAT_SMS_TEXT,
      expected: {
        amount: 1500000,
        remain: 800000,
        type: UncompletePaymentType.PAYMENT,
      },
    });

    const beforeConvert = await makeReq<Paginated<UncompletePayment>>({
      method: 'get',
      baseUrl: '/uncomplete-payments',
      token: users.owner.data.token,
    });

    expect(
      beforeConvert.data.rows.find((row) => row.id === pending.id),
    ).toBeDefined();

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
        uncompletePaymentId: pending.id,
      },
    });

    const afterConvert = await makeReq<Paginated<UncompletePayment>>({
      method: 'get',
      baseUrl: '/uncomplete-payments',
      token: users.owner.data.token,
    });

    expect(
      afterConvert.data.rows.find((row) => row.id === pending.id),
    ).toBeUndefined();
  });

  it('Moves an 8-digit amount without float rounding', async () => {
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
          amount: LARGE_AMOUNT,
          category: IncomeCategory.HOGHOOGH,
          paidAt: '2026-07-30 05:57:00',
          description: 'large amount funding for exchange e2e',
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
        fromAmount: LARGE_AMOUNT,
        toAmount: LARGE_AMOUNT,
        paidAt: '2026-07-30 06:00:00',
      },
    });
  });

  it('Rejects an amount with more than 15 significant digits', async () => {
    const userTest = await signinTestUsers(makeReq);
    const users = await userTest.test();

    const result = await makeReq({
      method: 'post',
      baseUrl: '/exchange',
      token: users.owner.data.token,
      body: {
        fromAccountId: 0,
        toAccountId: 0,
        toUser: users.relations.data[0].id,
        fromAmount: 123456789012.12345678,
        toAmount: 1,
        paidAt: '2026-07-30 06:00:00',
      },
    });

    expect(result.success).toBeFalsy();
    expect(result.message).toBe('VALIDATION_ERROR');
  });
});
