import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentRepository } from './entities/repositories/student.repository';
import { Student } from './entities/student.entity';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { FindAllStudentDto } from './dtos/find-all-student.dto';
import { Paginated } from 'src/common/types/pagination.type';
import { jsonToXlsx } from 'src/common/file/xlsx.logic';
import { createSearchObject } from 'src/common/ports/database/helpers.tool';
import { makeFilePublic, saveUploadedFile } from 'src/common/file/files.logic';
import { getFileName, getFileUrl } from 'src/common/file/files.logic';
import { UploadedFileRepository } from 'src/uploaded-file/entities/repositories/uploaded-file.repository';
import { UploadedFileTypesEnum } from 'src/uploaded-file/enums/uploaded-file-types.enum';

@Injectable()
export class StudentService {
  constructor(
    private uploadedFileRepository: UploadedFileRepository,
    private studentRepository: StudentRepository,
  ) {}

  //  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
  //    return this.studentRepository.create(createStudentDto);
  //  }

  async updateStudent(updateStudentDto: UpdateStudentDto, id: number) {
    return this.studentRepository.updateOneById(updateStudentDto, id);
  }

  async getBill(id: number) {
    const uploadedFile = await this.uploadedFileRepository.findOne({
      where: {
        modelType: 'students',
        modelId: id,
        uploadType: UploadedFileTypesEnum.BILL,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!uploadedFile) {
      throw new NotFoundException('no bill fount');
    }

    return makeFilePublic(uploadedFile.path);
  }

  async getCv(id: number) {
    const uploadedFile = await this.uploadedFileRepository.findOne({
      where: {
        modelType: 'students',
        modelId: id,
        uploadType: UploadedFileTypesEnum.CV,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!uploadedFile) {
      throw new NotFoundException('no cv fount');
    }

    return makeFilePublic(uploadedFile.path);
  }

  async uploadBill(id: number, file: Express.Multer.File) {
    const savedFile = await saveUploadedFile(
      getFileName(file.originalname, id),
      file.buffer,
      'students-bill',
    );

    await this.uploadedFileRepository.create({
      uploadType: UploadedFileTypesEnum.CV,
      modelId: id,
      modelType: 'students',
      path: savedFile,
    });
  }

  async uploadCv(id: number, file: Express.Multer.File) {
    const savedFile = await saveUploadedFile(
      getFileName(file.originalname, id),
      file.buffer,
      'students-cv',
    );

    await this.uploadedFileRepository.create({
      uploadType: UploadedFileTypesEnum.CV,
      modelId: id,
      modelType: 'students',
      path: savedFile,
    });
  }

  async findOneStudent(id: number) {
    return this.studentRepository.findOneById(id);
  }

  async findAllStudent(query: FindAllStudentDto): Promise<Paginated<Student>> {
    const { limit, page, q, ...where } = query;
    const searchObject = createSearchObject<Student>(q || '', [
      'certificateNumber',
      'firstName',
      'lastName',
      'phone',
      'nationalCode',
      'admissionNumber',
    ]);
    return this.studentRepository.pagination({
      where: { ...searchObject, ...where },
      limit: +limit,
      offset: +page - 1,
    });
  }

  async exportAllStudent(query: FindAllStudentDto): Promise<string> {
    const data = await this.findAllStudent(query);
    const path = await jsonToXlsx(data.rows);

    if (!path) {
      throw new Error();
    }

    return getFileUrl(path);
  }
}
