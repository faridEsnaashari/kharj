import { UncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { Paginated } from 'src/common/types/pagination.type';
import { createTestAccounts } from './account.logic';
import { makeAppReq } from './request.logic';
import { signinTestUsers } from './auth/signin.logic';

const RESALAT_SMS_TEXT = [
  '1234567890',
  '-1500000',
  '01/15_10:30',
  'مانده: 800000',
].join('\n');

export async function createTestUncompletePayment(
  makeReq: ReturnType<typeof makeAppReq>,
) {
  const { owner, relations } = await signinTestUsers(makeReq);
  const {
    after: accountAfter,
    ownerAccount,
    otherAccount,
  } = await createTestAccounts(makeReq);

  const funding = await makeReq<Income>({
    method: 'post',
    baseUrl: '/income',
    token: owner.data.token,
    body: {
      accountId: otherAccount.data.id,
      amount: 500,
      category: 'HOGHOOGH',
      paidAt: '2026-07-30 05:57:00',
      description: 'funding for uncomplete-payment e2e',
    },
  });

  expect(funding.success).toBeTruthy();

  const pending = await makeReq<UncompletePayment>({
    method: 'post',
    baseUrl: '/uncomplete-payments/text',
    token: owner.data.token,
    body: {
      bankId: ownerAccount.data.bankId,
      text: RESALAT_SMS_TEXT,
    },
  });

  expect(pending.success).toBeTruthy();
  expect(pending.data).toMatchObject({
    amount: 150,
    remain: 800000,
    type: 'PAYMENT',
  });
  expect([ownerAccount.data.id, otherAccount.data.id]).toContain(
    pending.data.accountId,
  );

  const payments = await makeReq<Payment[]>({
    method: 'post',
    baseUrl: '/payment',
    token: owner.data.token,
    body: {
      price: 150,
      bankId: ownerAccount.data.bankId,
      unitId: ownerAccount.data.unitId,
      ownerId: relations.data[0].id,
      category: 'FOOD',
      isFun: false,
      isMaman: false,
      paidAt: '2026-07-30 06:00:00',
      uncompletePaymentId: pending.data.id,
    },
  });

  expect(payments.success).toBeTruthy();

  const debitedPayment = payments.data.find(
    (p) => p.accountId === otherAccount.data.id,
  )!;

  expect(debitedPayment).toMatchObject({
    amount: 150,
    accountId: otherAccount.data.id,
    remain: 350,
    uncompletePaymentId: pending.data.id,
  });

  const debts = await makeReq<Paginated<AccountDebt>>({
    method: 'get',
    baseUrl: '/debt',
    token: owner.data.token,
    query: {
      fromUserId: String(relations.data[1].id),
      toUserId: String(relations.data[0].id),
    },
  });

  const debt = debts.data.rows.find((d) => d.paymentId === debitedPayment.id);

  expect(debt).toMatchObject({
    amount: 150,
    fromUserId: relations.data[1].id,
    toUserId: relations.data[0].id,
  });

  const remainingPending = await makeReq<Paginated<UncompletePayment>>({
    method: 'get',
    baseUrl: '/uncomplete-payments',
    token: owner.data.token,
  });

  expect(
    remainingPending.data.rows.find((row) => row.id === pending.data.id),
  ).toBeUndefined();

  const updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${otherAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(350);

  return {
    pending,
    payments,
    debt,
    after: async () => {
      for (const payment of payments.data) {
        await makeReq({
          method: 'delete',
          baseUrl: `/payment/${payment.id}`,
          token: owner.data.token,
        });
      }
      await makeReq({
        method: 'delete',
        baseUrl: `/uncomplete-payments/${pending.data.id}`,
        token: owner.data.token,
      });
      await makeReq({
        method: 'delete',
        baseUrl: `/income/${funding.data.id}`,
        token: owner.data.token,
      });
      await accountAfter();
    },
  };
}
