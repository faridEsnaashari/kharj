import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { SigninDto, signinDtoSchema } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signinDtoSchema))
  @Post(':id')
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
}
