import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SiteService } from './site.service';
//import {
//  UpdateSiteDto,
//  updateSiteDtoSchema,
//} from './dtos/update-site-student.dto';
import { HasAccessGuard } from 'src/common/guards/HasAccess.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('site')
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Get('')
  @UseGuards(HasAccessGuard)
  async findOneStudent(@Req() req: { user: { id: number } }) {
    return this.siteService.findOneStudent(req.user.id);
  }

  @Post('upload-cv')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(HasAccessGuard)
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: number } },
  ) {
    return this.siteService.uploadCv(req.user.id, file);
  }

  @Post('upload-bill')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(HasAccessGuard)
  async uploadBill(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: number } },
  ) {
    return this.siteService.uploadBill(req.user.id, file);
  }

  @Post('complete')
  @UseGuards(HasAccessGuard)
  async complete(@Req() req: { user: { id: number } }) {
    return this.siteService.complete(req.user.id);
  }
  //  @Post()
  //  @UsePipes(new ZodValidationPipe(createSiteDtoSchema))
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.CREATE_EXPERT])
  //  async createSite(@Body() createSiteDto: CreateSiteDto) {
  //    return this.siteService.createSite(createSiteDto);
  //  }
  //
  //  @Put(':id')
  //  @UseGuards(HasAccessGuard)
  //  @Permissions([PermissionsEnum.UPDATE_STUDENT])
  //  async updateSite(
  //    @Param('id') id: number,
  //    @Body(new ZodValidationPipe(updateSiteDtoSchema))
  //    updateSiteDto: UpdateSiteDto,
  //  ) {
  //    return this.siteService.updateSite(updateSiteDto, id);
  //  }
}
