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
  CreateExpertDto,
  createExpertDtoSchema,
} from './dtos/create-expert.dto';
import { ExpertService } from './expert.service';
import {
  UpdateExpertDto,
  updateExpertDtoSchema,
} from './dtos/update-expert.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { PermissionsEnum } from 'src/auth/enums/permissions.enum';
import {
  FindAllExpertDto,
  findAllExpertDtoSchema,
} from './dtos/find-all-expert.dto';

@Controller('expert')
export class ExpertController {
  constructor(private expertService: ExpertService) {}

  @Get('')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_EXPERT])
  async findAllExpert(
    @Query(new ZodValidationPipe(findAllExpertDtoSchema))
    query: FindAllExpertDto,
  ) {
    return this.expertService.findAllExpert(query);
  }

  @Get('export')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_EXPERT, PermissionsEnum.EXPORT_EXPERT])
  async exportAllExpert(
    @Query(new ZodValidationPipe(findAllExpertDtoSchema))
    query: FindAllExpertDto,
  ) {
    return this.expertService.exportAllExpert(query);
  }

  @Get(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_EXPERT])
  async findOneExpert(@Param('id') id: number) {
    return this.expertService.findOneExpert(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createExpertDtoSchema))
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.CREATE_EXPERT])
  async createExpert(@Body() createExpertDto: CreateExpertDto) {
    return this.expertService.createExpert(createExpertDto);
  }

  @Put(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.UPDATE_EXPERT])
  async updateExpert(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateExpertDtoSchema))
    updateExpertDto: UpdateExpertDto,
  ) {
    return this.expertService.updateExpert(updateExpertDto, id);
  }
}
