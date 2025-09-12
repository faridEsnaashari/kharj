import { Controller, Get, Param } from '@nestjs/common';
//import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UserService } from './user.service';
//import { UpdateUserDto, updateUserDtoSchema } from './dtos/update-user.dto';
//import { Permissions } from 'src/common/decorators/permissions.decorator';
//import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
//import { PermissionsEnum } from 'src/auth/enums/permissions.enum';
//import { FindAllUserDto, findAllUserDtoSchema } from './dtos/find-all-user.dto';
//import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':id')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.FIND_STUDENT])
  async findOneUser(@Param('id') id: number) {
    return this.userService.findOneUser(id);
  }
  //  @Get('')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.FIND_STUDENT])
  //  async findAllUser(
  //    @Query(new ZodValidationPipe(findAllUserDtoSchema))
  //    query: FindAllUserDto,
  //  ) {
  //    return this.userService.findAllUser(query);
  //  }
  //
  //  @Get('export')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.FIND_STUDENT, PermissionsEnum.EXPORT_STUDENT])
  //  async exportAllUser(
  //    @Query(new ZodValidationPipe(findAllUserDtoSchema))
  //    query: FindAllUserDto,
  //  ) {
  //    return this.userService.exportAllUser(query);
  //  }

  //  @Post()
  //  @UsePipes(new ZodValidationPipe(createUserDtoSchema))
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.CREATE_EXPERT])
  //  async createUser(@Body() createUserDto: CreateUserDto) {
  //    return this.userService.createUser(createUserDto);
  //  }
  //
  //  @Put(':id')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.UPDATE_STUDENT])
  //  async updateUser(
  //    @Param('id') id: number,
  //    @Body(new ZodValidationPipe(updateUserDtoSchema))
  //    updateUserDto: UpdateUserDto,
  //  ) {
  //    return this.userService.updateUser(updateUserDto, id);
  //  }
  //
  //  @Get(':id/bill')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.GET_BILL])
  //  async getBill(@Param('id') id: User['id']) {
  //    return this.userService.getBill(id);
  //  }
  //
  //  @Get(':id/cv')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.GET_CV])
  //  async cv(@Param('id') id: User['id']) {
  //    return this.userService.getCv(id);
  //  }
}
