import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  CreateManagerDto,
  createManagerDtoSchema,
} from './dtos/create-manager.dto';
import { ManagerService } from './manager.service';
import {
  UpdateManagerDto,
  updateManagerDtoSchema,
} from './dtos/update-manager.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { PermissionsEnum } from 'src/auth/enums/permissions.enum';
import {
  FindAllManagerDto,
  findAllManagerDtoSchema,
} from './dtos/find-all-manager.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('manager')
export class ManagerController {
  constructor(private managerService: ManagerService) {}

  @Get('')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_MANAGER])
  async findAllManager(
    @Query(new ZodValidationPipe(findAllManagerDtoSchema))
    query: FindAllManagerDto,
  ) {
    return this.managerService.findAllManager(query);
  }

  @Get('export')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_MANAGER, PermissionsEnum.EXPORT_MANAGER])
  async exportAllManager(
    @Query(new ZodValidationPipe(findAllManagerDtoSchema))
    query: FindAllManagerDto,
  ) {
    return this.managerService.exportAllManager(query);
  }

  @Get(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.FIND_MANAGER])
  async findOneManager(@Param('id') id: number) {
    return this.managerService.findOneManager(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createManagerDtoSchema))
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.CREATE_MANAGER])
  async createManager(@Body() createManagerDto: CreateManagerDto) {
    return this.managerService.createManager(createManagerDto);
  }

  @Post('upload-admissions')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.UPLOAD_ADMISSIONS])
  async uploadAdmission(@UploadedFile() file: Express.Multer.File) {
    return this.managerService.uploadAdmission(file);
  }

  @Put(':id')
  @UseGuards(HasAccessGuard)
  @Permissions([PermissionsEnum.UPDATE_MANAGER])
  async updateManager(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateManagerDtoSchema))
    updateManagerDto: UpdateManagerDto,
  ) {
    return this.managerService.updateManager(updateManagerDto, id);
  }
}
