import { NestExpressApplication } from '@nestjs/platform-express';
import { createTestApp } from './utils/create-test-app';
import { createTestAccount } from './logics/account.logic';
import { createTestIncome } from './logics/income.logic';
import { createTestPayment } from './logics/payment.logic';
import { createTestUncompletePayment } from './logics/uncomplete-payment.logic';
import { signinTestUsers } from './logics/auth/signin.logic';
import { makeAppReq } from './utils/request.logic';
import { IncomeCategory } from 'src/income/enums/income-category.enum';
import { PaymentCategory } from 'src/payment/enums/payment-category.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';
import { Paginated } from 'src/common/types/pagination.type';
import { UncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';

const RESALAT_SMS_TEXT = [
  '1234567890',
  '-1500000',
  '01/15_10:30',
  'مانده: 800000',
].join('\n');

describe('Create Uncomplete Payments', () => {
  let app: NestExpressApplication;
  let makeReq: ReturnType<typeof makeAppReq>;
  let accountTest: ReturnType<typeof createTestAccount>;
  let incomeTest: ReturnType<typeof createTestIncome>;
  let uncompletePaymentTest: ReturnType<typeof createTestUncompletePayment>;
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
    uncompletePaymentTest = createTestUncompletePayment(makeReq);
    paymentTest = createTestPayment(makeReq);
  });

  afterEach(async () => {
    await paymentTest.after();
    await uncompletePaymentTest.after();
    await incomeTest.after();
    await accountTest.after();
  });

  it('Parses an SMS import and converts it into a payment that records a debt', async () => {
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
          description: 'funding for uncomplete-payment e2e',
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

    expect([ownerAccount.data.id, otherAccount.data.id]).toContain(
      pending.accountId,
    );

    await paymentTest.test({
      users,
      debitedAccount: otherAccount.data,
      creditedAccount: ownerAccount.data,
      payment: {
        price: 150,
        bankId: ownerAccount.data.bankId,
        unitId: ownerAccount.data.unitId,
        ownerId: ownerAccount.data.ownedBy,
        category: PaymentCategory.FOOD,
        isFun: false,
        isMaman: false,
        paidAt: '2026-07-30 06:00:00',
        uncompletePaymentId: pending.id,
      },
    });

    const remainingPending = await makeReq<Paginated<UncompletePayment>>({
      method: 'get',
      baseUrl: '/uncomplete-payments',
      token: users.owner.data.token,
    });

    expect(
      remainingPending.data.rows.find((row) => row.id === pending.id),
    ).toBeUndefined();
  });
});
