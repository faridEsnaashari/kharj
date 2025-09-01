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
import { PermissionsEnum } from '../enums/permissions.enum';
import { ManagerModel } from 'src/manager/entities/manager.entity';
import { ExpertModel } from 'src/expert/entities/expert.entity';
import { TeacherModel } from 'src/teacher/entities/teacher.entity';
import { StudentModel } from 'src/student/entities/student.entity';

export type UserHasPermission = {
  id: number;
  modelType: 'managers' | 'experts' | 'teachers' | 'students';
  modelId: number;
  permission: PermissionsEnum;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserHasPermissoin = CreateEntity<UserHasPermission>;
export type UpdateUserHasPermissoin = UpdateEntity<UserHasPermission>;

@Table({ tableName: 'user_has_permissions', underscored: true })
export class UserHasPermissionModel
  extends Model<UserHasPermission, CreateUserHasPermissoin>
  implements UserHasPermission
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  modelType!: 'managers' | 'experts' | 'teachers' | 'students';

  @ForeignKey(() => ExpertModel)
  @ForeignKey(() => ManagerModel)
  @ForeignKey(() => TeacherModel)
  @ForeignKey(() => StudentModel)
  @AllowNull(false)
  @Column
  modelId!: number;

  @AllowNull(false)
  @Column
  permission!: PermissionsEnum;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
