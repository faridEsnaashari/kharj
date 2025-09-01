import { CreateUserHasPermissoin } from '../entities/user-has-permission.entity';
import { PermissionsEnum } from '../enums/permissions.enum';
import { RolesEnum } from '../enums/roles.enum';

export function createUserHasPermModel(
  permissions: PermissionsEnum[],
  modelId: number,
  modelType: RolesEnum,
): CreateUserHasPermissoin[] {
  return permissions.map((p) => ({
    permission: p,
    modelType: (modelType.toLowerCase() + 's') as
      | 'managers'
      | 'experts'
      | 'teachers'
      | 'students',
    modelId,
  }));
}
