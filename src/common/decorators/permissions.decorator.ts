import { Reflector } from '@nestjs/core';
import { PermissionsEnum } from 'src/auth/enums/permissions.enum';

export const Permissions = Reflector.createDecorator<PermissionsEnum[]>();
