import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserHasPermissionModel } from 'src/auth/entities/user-has-permission.entity';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  nationalCode: string;
  certificateNumber: string;
  fileNumber: number;
  admissionNumber: number;
  interviewCode?: number;
  lastUniversityName: string;
  lastUniversityCode: number;
  degreeIssuedDate: string;
  lastFieldOfStudyCode: number;
  lastFieldOfStudyCodeName: string;
  gpa: number;
  resistanceCityCode: number;
  resistanceCityName: string;
  examFieldStudyCode: number;
  examFieldStudyName: string;
  fieldOfStudyId: number;
  quotaType: string;
  totalGrade: number;
  status: number;
  period: number;
  interviewUniversityCode: number;
  interviewUniversityName: string;
  certificateIssuedPlaceCode: number;
  certificateIssuedPlaceName: string;
  birthPlaceCode: number;
  birthPlaceName: string;
  birthOfDate: string;
  fatherName: string;
  gender: 'MALE' | 'FEMALE';
  permissions?: UserHasPermissionModel[];
  createdAt: string;
  updatedAt: string;
};

export type CreateStudent = CreateEntity<Student>;
export type UpdateStudent = UpdateEntity<Student>;

@Table({ tableName: 'students', underscored: true })
export class StudentModel
  extends Model<Student, CreateStudent>
  implements Student
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  certificateNumber!: string;

  @AllowNull(false)
  @Column
  fileNumber!: number;

  @AllowNull(false)
  @Column
  admissionNumber!: number;

  @AllowNull(false)
  @Column
  interviewCode!: number;

  @AllowNull(false)
  @Column
  lastUniversityName!: string;

  @AllowNull(false)
  @Column
  lastUniversityCode!: number;

  @AllowNull(false)
  @Column
  degreeIssuedDate!: string;

  @AllowNull(false)
  @Column
  lastFieldOfStudyCode!: number;

  @AllowNull(false)
  @Column
  lastFieldOfStudyCodeName!: string;

  @AllowNull(false)
  @Column
  gpa!: number;

  @AllowNull(false)
  @Column
  resistanceCityCode!: number;

  @AllowNull(false)
  @Column
  resistanceCityName!: string;

  @AllowNull(false)
  @Column
  examFieldStudyCode!: number;

  @AllowNull(false)
  @Column
  examFieldStudyName!: string;

  @AllowNull(false)
  @Column
  fieldOfStudyId!: number;

  @AllowNull(false)
  @Column
  quotaType!: string;

  @AllowNull(false)
  @Column
  totalGrade!: number;

  @AllowNull(false)
  @Column
  status!: number;

  @AllowNull(false)
  @Column
  period!: number;

  @AllowNull(false)
  @Column
  interviewUniversityCode!: number;

  @AllowNull(false)
  @Column
  interviewUniversityName!: string;

  @AllowNull(false)
  @Column
  certificateIssuedPlaceCode!: number;

  @AllowNull(false)
  @Column
  certificateIssuedPlaceName!: string;

  @AllowNull(false)
  @Column
  birthPlaceCode!: number;

  @AllowNull(false)
  @Column
  birthPlaceName!: string;

  @AllowNull(false)
  @Default('admin')
  @Column
  firstName!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @AllowNull(false)
  @Default('admin')
  @Column
  lastName!: string;

  @AllowNull(true)
  @Column
  fatherName!: string;

  @AllowNull(true)
  @Column
  phone!: string;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  birthOfDate!: string;

  @AllowNull(true)
  @Column
  nationalCode!: string;

  @AllowNull(false)
  @Default('MALE')
  @Column
  gender!: 'MALE' | 'FEMALE';

  @HasMany(() => UserHasPermissionModel, {
    as: 'permissions',
    scope: { modelType: 'students' },
  })
  permissions!: UserHasPermissionModel[];

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
