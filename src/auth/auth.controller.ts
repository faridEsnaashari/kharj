import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import {
  ExpertLoginDto,
  ManagerLoginDto,
  StudentLoginDto,
  TeachertLoginDto,
  expertLoginDtoSchema,
  managerLoginDtoSchema,
  studentLoginDtoSchema,
  teacherLoginDtoSchema,
} from './dtos/login.dto';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { PermissionsEnum } from './enums/permissions.enum';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import {
  AssignPermissionsDto,
  assignPermissionsDtoSchema,
} from './dtos/assign-permissions.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('manager/login')
  @UsePipes(new ZodValidationPipe(managerLoginDtoSchema))
  async loginManager(@Body() login: ManagerLoginDto) {
    return this.authService.loginManager(login);
  }

  @Post('expert/login')
  @UsePipes(new ZodValidationPipe(expertLoginDtoSchema))
  async loginExpert(@Body() login: ExpertLoginDto) {
    return this.authService.loginExpert(login);
  }

  @Post('teacher/login')
  @UsePipes(new ZodValidationPipe(teacherLoginDtoSchema))
  async loginTeacher(@Body() login: TeachertLoginDto) {
    return this.authService.loginTeacher(login);
  }

  @Post('student/login')
  @UsePipes(new ZodValidationPipe(studentLoginDtoSchema))
  async loginStudent(@Body() login: StudentLoginDto) {
    return this.authService.loginStudent(login);
  }

  @Get('permissions')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_TEACHER])
  getPermissions() {
    return this.authService.getPermissions();
  }

  @Post('assign-permissions')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_TEACHER])
  @UsePipes(new ZodValidationPipe(assignPermissionsDtoSchema))
  async assignPermissions(@Body() body: AssignPermissionsDto) {
    this.authService.assignPermissions(body.permissions, body.id, body.type);
  }
}
