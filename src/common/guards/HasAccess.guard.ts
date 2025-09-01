import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  authenticateLogic,
  authorizeLogic,
  getToken,
} from 'src/auth/logics/auth.logic';
import { ManagerRepository } from 'src/manager/entities/repositories/manager.repository';
import { Permissions } from '../decorators/permissions.decorator';
import { Reflector } from '@nestjs/core';
import { ExpertRepository } from 'src/expert/entities/repositories/expert.repository';
import { TeacherRepository } from 'src/teacher/entities/repositories/teacher.repository';
import { StudentRepository } from 'src/student/entities/repositories/student.repository';

@Injectable()
export class HasAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private managerRepo: ManagerRepository,
    private expertRepo: ExpertRepository,
    private teacherRepo: TeacherRepository,
    private studentRepo: StudentRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, context.getHandler());
    const request = context.switchToHttp().getRequest();

    const token = getToken(request.headers);
    if (!token) {
      return false;
    }

    const user = await authenticateLogic(token, {
      getManager: async (userObj) => this.managerRepo.findOne(userObj),
      getExpert: async (userObj) => this.expertRepo.findOne(userObj),
      getTeacher: async (userObj) => this.teacherRepo.findOne(userObj),
      getStudent: async (userObj) => this.studentRepo.findOne(userObj),
    });

    if (!user) {
      return false;
    }

    const checkPermission = authorizeLogic(
      permissions || [],
      user.user?.permissions || [],
    );

    if (!checkPermission) {
      return false;
    }

    request['user'] = user.user;
    request['userRole'] = user.role;

    return true;
  }
}
