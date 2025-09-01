import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  CreateFieldOfStudyDto,
  createFieldOfStudyDtoSchema,
} from './dtos/create-field-of-study.dto';
import { FieldOfStudyService } from './field-of-study.service';
import {
  UpdateFieldOfStudyDto,
  updateFieldOfStudyDtoSchema,
} from './dtos/update-field-of-study.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { PermissionsEnum } from 'src/auth/enums/permissions.enum';

@Controller('field-of-study')
export class FieldOfStudyController {
  constructor(private fieldOfStudyService: FieldOfStudyService) {}

  @Get('')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_FIELD_OF_STUDY])
  async findAllFieldOfStudy() {
    return this.fieldOfStudyService.findAllFieldOfStudy();
  }

  @Get(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_FIELD_OF_STUDY])
  async findOneFieldOfStudy(@Param('id') id: number) {
    return this.fieldOfStudyService.findOneFieldOfStudy(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createFieldOfStudyDtoSchema))
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.CREATE_FIELD_OF_STUDY])
  async createFieldOfStudy(
    @Body() createFieldOfStudyDto: CreateFieldOfStudyDto,
  ) {
    return this.fieldOfStudyService.createFieldOfStudy(createFieldOfStudyDto);
  }

  @Put(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.UPDATE_FIELD_OF_STUDY])
  async updateFieldOfStudy(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateFieldOfStudyDtoSchema))
    updateFieldOfStudyDto: UpdateFieldOfStudyDto,
  ) {
    return this.fieldOfStudyService.updateFieldOfStudy(
      updateFieldOfStudyDto,
      id,
    );
  }
}
