import { e2eTestUser } from '../../utils/create-test-app';
import { UserRelation } from 'src/user/entities/user-relation.entity';
import {
  KharjResponse,
  makeAppReq,
  SignedInUser,
} from '../../utils/request.logic';

export async function signinTestUsers(makeReq: ReturnType<typeof makeAppReq>) {
  return {
    test: async () => {
      const owner = await makeReq<SignedInUser>({
        method: 'post',
        baseUrl: '/auth/signin',
        body: {
          username: e2eTestUser.owner.name,
          password: e2eTestUser.owner.password,
        },
      });

      const relations = await makeReq<UserRelation[]>({
        method: 'get',
        baseUrl: '/user/related-user',
        token: owner.data.token,
      });

      expect(relations.data.length).toBe(2);
      expect(relations.data.map((r) => r.id)).toEqual([22, 23]);
      return { owner, relations };
    },
    after: () => {},
  };
}

export type SignedInUserTest = {
  owner: KharjResponse<SignedInUser>;
  relations: KharjResponse<UserRelation[]>;
};
