import { Injectable } from '@nestjs/common';
import { UserRepository } from './entities/repositories/user.repository';
//import { User } from './entities/user.entity';
//import { UpdateUserDto } from './dtos/update-user.dto';
//import { FindAllUserDto } from './dtos/find-all-user.dto';
//import { Paginated } from 'src/common/types/pagination.type';
//import { jsonToXlsx } from 'src/common/file/xlsx.logic';
//import { createSearchObject } from 'src/common/ports/database/helpers.tool';
//import { makeFilePublic, saveUploadedFile } from 'src/common/file/files.logic';
//import { getFileName, getFileUrl } from 'src/common/file/files.logic';
//import { UploadedFileRepository } from 'src/uploaded-file/entities/repositories/uploaded-file.repository';
//import { UploadedFileTypesEnum } from 'src/uploaded-file/enums/uploaded-file-types.enum';

@Injectable()
export class UserService {
  constructor(
    //private uploadedFileRepository: UploadedFileRepository,
    private userRepository: UserRepository,
  ) {}

  //  async createUser(createUserDto: CreateUserDto): Promise<User> {
  //    return this.userRepository.create(createUserDto);
  //  }

  //  async updateUser(updateUserDto: UpdateUserDto, id: number) {
  //    return this.userRepository.updateOneById(updateUserDto, id);
  //  }
  //
  //  async getBill(id: number) {
  //    const uploadedFile = await this.uploadedFileRepository.findOne({
  //      where: {
  //        modelType: 'users',
  //        modelId: id,
  //        uploadType: UploadedFileTypesEnum.BILL,
  //      },
  //      order: [['createdAt', 'DESC']],
  //    }); //
  //    if (!uploadedFile) {
  //      throw new NotFoundException('no bill fount');
  //    }
  //
  //    return makeFilePublic(uploadedFile.path);
  //  }
  //
  //  async getCv(id: number) {
  //    const uploadedFile = await this.uploadedFileRepository.findOne({
  //      where: {
  //        modelType: 'users',
  //        modelId: id,
  //        uploadType: UploadedFileTypesEnum.CV,
  //      },
  //      order: [['createdAt', 'DESC']],
  //    });
  //
  //    if (!uploadedFile) {
  //      throw new NotFoundException('no cv fount');
  //    }
  //
  //    return makeFilePublic(uploadedFile.path);
  //  }
  //
  //  async uploadBill(id: number, file: Express.Multer.File) {
  //    const savedFile = await saveUploadedFile(
  //      getFileName(file.originalname, id),
  //      file.buffer,
  //      'users-bill',
  //    );
  //
  //    await this.uploadedFileRepository.create({
  //      uploadType: UploadedFileTypesEnum.CV,
  //      modelId: id,
  //      modelType: 'users',
  //      path: savedFile,
  //    });
  //  }
  //
  //  async uploadCv(id: number, file: Express.Multer.File) {
  //    const savedFile = await saveUploadedFile(
  //      getFileName(file.originalname, id),
  //      file.buffer,
  //      'users-cv',
  //    );
  //
  //    await this.uploadedFileRepository.create({
  //      uploadType: UploadedFileTypesEnum.CV,
  //      modelId: id,
  //      modelType: 'users',
  //      path: savedFile,
  //    });
  //  }

  async findOneUser(id: number) {
    return this.userRepository.findOneById(id);
  }
  //
  //  async findAllUser(query: FindAllUserDto): Promise<Paginated<User>> {
  //    const { limit, page, q, ...where } = query;
  //    const searchObject = createSearchObject<User>(q || '', ['name']);
  //    return this.userRepository.pagination({
  //      where: { ...searchObject, ...where },
  //      limit: +limit,
  //      offset: +page - 1,
  //    });
  //  }
  //
  //  async exportAllUser(query: FindAllUserDto): Promise<string> {
  //    const data = await this.findAllUser(query);
  //    const path = await jsonToXlsx(data.rows);
  //
  //    if (!path) {
  //      throw new Error();
  //    }
  //
  //    return getFileUrl(path);
  //  }
}
