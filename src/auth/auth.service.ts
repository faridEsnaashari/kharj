import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/entities/repositories/user.repository';
import { createUserToken } from './logics/jwt.logic';
import { SigninDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async signin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto;

    const user = await this.userRepo.findOneOrFail({
      where: { name: username, password },
    });

    const token = await createUserToken({ name: user.name, id: user.id });

    return { token };
  }
}
