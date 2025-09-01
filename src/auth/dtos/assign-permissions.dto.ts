import { z } from 'zod';
import { PermissionsEnum } from '../enums/permissions.enum';
import { RolesEnum } from '../enums/roles.enum';

export const assignPermissionsDtoSchema = z
  .object({
    permissions: z.array(z.nativeEnum(PermissionsEnum)).min(1),
    id: z.number(),
    type: z.nativeEnum(RolesEnum),
  })
  .required();

export type AssignPermissionsDto = Required<
  z.infer<typeof assignPermissionsDtoSchema>
>;
