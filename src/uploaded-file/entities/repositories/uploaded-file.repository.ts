import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUploadedFile,
  UploadedFile,
  UpdateUploadedFile,
  UploadedFileModel,
} from '../uploaded-file.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';

@Injectable()
export class UploadedFileRepository {
  constructor(
    @InjectModel(UploadedFileModel)
    private uploadedFileModel: typeof UploadedFileModel,
  ) {}

  async create(
    UploadedFile: CreateUploadedFile,
    raw = true,
  ): Promise<UploadedFile> {
    const result = await this.uploadedFileModel.create(UploadedFile);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<UploadedFile> | WhereOptions<UploadedFile>,
    raw = true,
  ): Promise<UploadedFile | null> {
    const result = await this.uploadedFileModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateUploadedFile)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneById(
    id: UploadedFile['id'],
    raw = true,
  ): Promise<UploadedFile | null> {
    const result = await this.uploadedFileModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneOrFail(
    conditions: FindOptions<UploadedFile> | WhereOptions<UploadedFile>,
    raw = true,
  ): Promise<UploadedFile | null> {
    const result = await this.uploadedFileModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateUploadedFile)
        : undefined,
      ...conditions,
    });

    if (!result) {
      throw new NotFoundException('student not found');
    }

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }
}
