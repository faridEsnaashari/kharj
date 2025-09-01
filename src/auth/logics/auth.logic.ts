import * as jwt from 'jsonwebtoken';
import { authConfigs } from '../auth.configs';
import { Manager } from 'src/manager/entities/manager.entity';
import { RolesEnum } from '../enums/roles.enum';
import { PermissionsEnum } from '../enums/permissions.enum';
import { Expert } from 'src/expert/entities/expert.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Student } from 'src/student/entities/student.entity';

export async function authenticateLogic(
  token: string,
  getUserFns: {
    getManager: (userObj: {
      nationalCode: string;
      password: string;
    }) => Promise<Manager | null>;
    getExpert: (userObj: {
      nationalCode: string;
      password: string;
    }) => Promise<Expert | null>;
    getTeacher: (userObj: {
      nationalCode: string;
      password: string;
    }) => Promise<Teacher | null>;
    getStudent: (userObj: {
      nationalCode: string;
      password: string;
    }) => Promise<Student | null>;
  },
): Promise<
  | {
      user: Omit<Manager | Expert | Teacher | Student, 'permissions'> & {
        permissions: PermissionsEnum[];
      };
      role: RolesEnum;
    }
  | false
> {
  const userObj = jwt.verify(token, authConfigs.jwtSecretKey);

  if (
    typeof userObj === 'string' ||
    typeof userObj.username !== 'string' ||
    typeof userObj.password !== 'string' ||
    typeof userObj.role !== 'string'
  ) {
    return false;
  }

  if (userObj.role === RolesEnum.MANAGER) {
    const user = await authenticateModelLogic<Manager>(
      { username: userObj.username, password: userObj.password },
      getUserFns.getManager,
    );

    if (!user) {
      return false;
    }

    return {
      user: {
        ...user,
        permissions: userObj.permissions || [],
      },
      role: RolesEnum.MANAGER,
    };
  }

  if (userObj.role === RolesEnum.EXPERT) {
    const user = await authenticateModelLogic<Expert>(
      { username: userObj.username, password: userObj.password },
      getUserFns.getExpert,
    );

    if (!user) {
      return false;
    }

    return {
      user: {
        ...user,
        permissions: userObj.permissions || [],
      },
      role: RolesEnum.EXPERT,
    };
  }

  if (userObj.role === RolesEnum.TEACHER) {
    const user = await authenticateModelLogic<Teacher>(
      { username: userObj.username, password: userObj.password },
      getUserFns.getTeacher,
    );

    if (!user) {
      return false;
    }

    return {
      user: {
        ...user,
        permissions: userObj.permissions || [],
      },
      role: RolesEnum.TEACHER,
    };
  }

  if (userObj.role === RolesEnum.STUDENT) {
    const user = await authenticateModelLogic<Student>(
      { username: userObj.username, password: userObj.password },
      getUserFns.getStudent,
    );

    if (!user) {
      return false;
    }

    return {
      user: {
        ...user,
        permissions: userObj.permissions || [],
      },
      role: RolesEnum.STUDENT,
    };
  }

  return false;
}

async function authenticateModelLogic<T extends Manager | Expert | Student>(
  userObj: { username: string; password: string },
  getUser: (userObj: {
    nationalCode: string;
    password: string;
  }) => Promise<T | null>,
): Promise<T | false> {
  const user = await getUser({
    nationalCode: userObj.username,
    password: userObj.password,
  });

  if (!user) {
    return false;
  }

  return user;
}

export function getToken(headerObject: {
  authorization?: string;
}): string | false {
  if (!headerObject.authorization) {
    return false;
  }

  const token = headerObject.authorization.split('Bearer ')[1];
  if (token.length < 1) {
    return false;
  }

  return token;
}

export function authorizeLogic(
  neededPermission: PermissionsEnum[],
  userPermissions: PermissionsEnum[],
): boolean {
  if (userPermissions.includes(PermissionsEnum.ALL)) {
    return true;
  }

  return neededPermission.every((np) => userPermissions.includes(np));
}
