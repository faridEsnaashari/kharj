import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CreateEntity, UpdateEntity } from 'src/common/types/entity.type';

export type FieldOfStudy = {
  id: number;
  code: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateFieldOfStudy = CreateEntity<FieldOfStudy>;
export type UpdateFieldOfStudy = UpdateEntity<FieldOfStudy>;

@Table({ tableName: 'field_of_studies', underscored: true })
export class FieldOfStudyModel
  extends Model<FieldOfStudy, CreateFieldOfStudy>
  implements FieldOfStudy
{
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  code!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}
