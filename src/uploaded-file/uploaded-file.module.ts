import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UploadedFileModel } from './entities/uploaded-file.entity';
import { UploadedFileRepository } from './entities/repositories/uploaded-file.repository';

@Module({
  imports: [SequelizeModule.forFeature([UploadedFileModel])],
  providers: [UploadedFileRepository],
  exports: [UploadedFileRepository],
})
export class UploadedFileModule {}
