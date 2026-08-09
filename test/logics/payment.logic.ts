import { Payment } from 'src/payment/entities/payment.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { Paginated } from 'src/common/types/pagination.type';
import { date } from 'src/common/tools/date/date.tool';
import { PaymentCategory } from 'src/payment/enums/payment-category.enum';
import { SignedInUserTest } from './auth/signin.logic';
import { makeAppReq } from 'test/utils/request.logic';

export type TestPayment = {
  price: Payment['amount'];
  bankId: Account['bankId'];
  unitId: Account['unitId'];
  ownerId: Account['ownedBy'];
  category: PaymentCategory;
  isFun: Payment['isFun'];
  isMaman: Payment['isMaman'];
  paidAt: Payment['paidAt'];
  description?: Payment['description'];
  uncompletePaymentId?: Payment['uncompletePaymentId'];
};

export function createTestPayment(makeReq: ReturnType<typeof makeAppReq>) {
  let owner: SignedInUserTest['owner'] | null = null;
  const created: Payment[] = [];

  return {
    test: async ({
      users,
      debitedAccount,
      creditedAccount,
      payment,
    }: {
      users: SignedInUserTest;
      debitedAccount: Account;
      creditedAccount?: Account;
      payment: TestPayment;
    }) => {
      owner = users.owner;

      const payments = await makeReq<Payment[]>({
        method: 'post',
        baseUrl: '/payment',
        token: owner.data.token,
        body: payment,
      });

      expect(payments.success).toBeTruthy();
      created.push(...payments.data);

      const debitedPayment = payments.data.find(
        (p) => p.accountId === debitedAccount.id,
      )!;

      expect({
        ...debitedPayment,
        paidAt: date(debitedPayment.paidAt).format('YYYY-MM-DD HH:mm:ss'),
      }).toMatchObject({
        amount: payment.price,
        category: payment.category,
        ...(payment.description ? { description: payment.description } : {}),
        paidAt: payment.paidAt,
        accountId: debitedAccount.id,
      });

      if (creditedAccount) {
        const creditedPayment = payments.data.find(
          (p) => p.accountId === creditedAccount.id,
        );

        expect(creditedPayment).toMatchObject({
          accountId: creditedAccount.id,
          amount: 0,
        });

        const debts = await makeReq<Paginated<AccountDebt>>({
          method: 'get',
          baseUrl: '/debt',
          token: owner.data.token,
          query: {
            fromUserId: String(debitedAccount.ownedBy),
            toUserId: String(creditedAccount.ownedBy),
          },
        });

        const debt = debts.data.rows.find(
          (d) => d.paymentId === debitedPayment.id,
        );

        expect(debt).toMatchObject({
          amount: payment.price,
          fromUserId: debitedAccount.ownedBy,
          toUserId: creditedAccount.ownedBy,
        });
      }

      return payments.data;
    },
    after: async () => {
      return Promise.all(
        created.map((payment) =>
          makeReq({
            method: 'delete',
            baseUrl: `/payment/${payment.id}`,
            token: owner?.data.token,
          }),
        ),
      );
    },
  };
}
