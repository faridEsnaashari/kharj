import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadDtoSchema } from './dtos/upload.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UsePipes(new ZodValidationPipe(uploadDtoSchema))
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(HasAccessGuard)
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.upload(file);
  }

  @Post('upload/bank-payment')
  @UsePipes(new ZodValidationPipe(uploadDtoSchema))
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(HasAccessGuard)
  async uploadBank(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadBank(file);
  }
}
