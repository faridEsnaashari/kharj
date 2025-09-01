import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { StudentService } from './student.service';
import {
  UpdateStudentDto,
  updateStudentDtoSchema,
} from './dtos/update-student.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { PermissionsEnum } from 'src/auth/enums/permissions.enum';
import {
  FindAllStudentDto,
  findAllStudentDtoSchema,
} from './dtos/find-all-student.dto';
import { Student } from './entities/student.entity';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get('')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_STUDENT])
  async findAllStudent(
    @Query(new ZodValidationPipe(findAllStudentDtoSchema))
    query: FindAllStudentDto,
  ) {
    return this.studentService.findAllStudent(query);
  }

  @Get('export')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_STUDENT, PermissionsEnum.EXPORT_STUDENT])
  async exportAllStudent(
    @Query(new ZodValidationPipe(findAllStudentDtoSchema))
    query: FindAllStudentDto,
  ) {
    return this.studentService.exportAllStudent(query);
  }

  @Get(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_STUDENT])
  async findOneStudent(@Param('id') id: number) {
    return this.studentService.findOneStudent(id);
  }

  //  @Post()
  //  @UsePipes(new ZodValidationPipe(createStudentDtoSchema))
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.CREATE_EXPERT])
  //  async createStudent(@Body() createStudentDto: CreateStudentDto) {
  //    return this.studentService.createStudent(createStudentDto);
  //  }
  //
  @Put(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.UPDATE_STUDENT])
  async updateStudent(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateStudentDtoSchema))
    updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudent(updateStudentDto, id);
  }

  @Get(':id/bill')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.GET_BILL])
  async getBill(@Param('id') id: Student['id']) {
    return this.studentService.getBill(id);
  }

  @Get(':id/cv')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.GET_CV])
  async cv(@Param('id') id: Student['id']) {
    return this.studentService.getCv(id);
  }
}
