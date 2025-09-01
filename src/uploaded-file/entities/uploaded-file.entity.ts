import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';
import { UploadedFileTypesEnum } from '../enums/uploaded-file-types.enum';
import { StudentModel } from 'src/student/entities/student.entity';

export type UploadedFile = {
  id: number;
  modelType: string;
  modelId: number;
  uploadType: UploadedFileTypesEnum;
  path: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUploadedFile = CreateEntity<UploadedFile>;
export type UpdateUploadedFile = UpdateEntity<UploadedFile>;

@Table({ tableName: 'uploaded_files', underscored: true })
export class UploadedFileModel
  extends Model<UploadedFile, CreateUploadedFile>
  implements UploadedFile
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  @ForeignKey(() => StudentModel)
  modelId!: number;

  @AllowNull(false)
  @Column
  uploadType!: UploadedFileTypesEnum;

  @AllowNull(false)
  @Column
  modelType!: string;

  @AllowNull(false)
  @Column
  path!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
