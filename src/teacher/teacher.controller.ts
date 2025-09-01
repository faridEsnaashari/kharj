import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  CreateTeacherDto,
  createTeacherDtoSchema,
} from './dtos/create-teacher.dto';
import { TeacherService } from './teacher.service';
import {
  UpdateTeacherDto,
  updateTeacherDtoSchema,
} from './dtos/update-teacher.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { PermissionsEnum } from 'src/auth/enums/permissions.enum';
import {
  FindAllTeacherDto,
  findAllTeacherDtoSchema,
} from './dtos/find-all-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Get('')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_TEACHER])
  async findAllTeacher(
    @Query(new ZodValidationPipe(findAllTeacherDtoSchema))
    query: FindAllTeacherDto,
  ) {
    return this.teacherService.findAllTeacher(query);
  }

  @Get('export')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_TEACHER, PermissionsEnum.EXPORT_TEACHER])
  async exportAllTeacher(
    @Query(new ZodValidationPipe(findAllTeacherDtoSchema))
    query: FindAllTeacherDto,
  ) {
    return this.teacherService.exportAllTeacher(query);
  }

  @Get(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_TEACHER])
  async findOneTeacher(@Param('id') id: number) {
    return this.teacherService.findOneTeacher(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTeacherDtoSchema))
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.CREATE_TEACHER])
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Put(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.UPDATE_TEACHER])
  async updateTeacher(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateTeacherDtoSchema))
    updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacher(updateTeacherDto, id);
  }
}
