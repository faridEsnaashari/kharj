import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('related-user')
  @UseGuards(HasAccessGuard)
  async getRelatedUsers(@Req() req: { user: User }) {
    return this.userService.findRelatedUsers(req.user.id);
  }
}
