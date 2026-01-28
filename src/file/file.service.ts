import { Injectable } from '@nestjs/common';
import { getFileName, saveUploadedFile } from 'src/file/logics/file.logic';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File) {
    const savedFile = await saveUploadedFile(
      getFileName(file.originalname),
      file.buffer,
    );

    return savedFile.fileName;
  }

  async uploadBank(file: Express.Multer.File) {
    const savedFile = await saveUploadedFile(
      getFileName(file.originalname),
      file.buffer,
      'bank-upload',
    );

    return savedFile.fileName;
  }
}
