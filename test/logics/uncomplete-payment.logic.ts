import { UncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { Account } from 'src/account/entities/account.entity';
import { SignedInUserTest } from './auth/signin.logic';
import { makeAppReq } from 'test/utils/request.logic';

export function createTestUncompletePayment(
  makeReq: ReturnType<typeof makeAppReq>,
) {
  let owner: SignedInUserTest['owner'] | null = null;
  const created: UncompletePayment[] = [];

  return {
    test: async ({
      users,
      bankId,
      text,
      expected,
    }: {
      users: SignedInUserTest;
      bankId: Account['bankId'];
      text: string;
      expected: Partial<UncompletePayment>;
    }) => {
      owner = users.owner;

      const pending = await makeReq<UncompletePayment>({
        method: 'post',
        baseUrl: '/uncomplete-payments/text',
        token: owner.data.token,
        body: { bankId, text },
      });

      created.push(pending.data);

      expect(pending.success).toBeTruthy();
      expect(pending.data).toMatchObject(expected);

      return pending.data;
    },
    after: async () => {
      return Promise.all(
        created.map((pending) =>
          makeReq({
            method: 'delete',
            baseUrl: `/uncomplete-payments/${pending.id}`,
            token: owner?.data.token,
          }),
        ),
      );
    },
  };
}
