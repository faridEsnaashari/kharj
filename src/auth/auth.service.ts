import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginLogic } from './logics/login.logic';
import { ManagerRepository } from 'src/manager/entities/repositories/manager.repository';
import {
  ExpertLoginDto,
  ManagerLoginDto,
  StudentLoginDto,
  TeachertLoginDto,
} from './dtos/login.dto';
import { RolesEnum } from './enums/roles.enum';
import {
  UserHasPermission,
  UserHasPermissionModel,
} from './entities/user-has-permission.entity';
import { ExpertRepository } from 'src/expert/entities/repositories/expert.repository';
import { TeacherRepository } from 'src/teacher/entities/repositories/teacher.repository';
import { PermissionsEnum } from './enums/permissions.enum';
import { UserHasPermissionRepository } from './entities/repositories/user-has-permissions.repository';
import { createUserHasPermModel } from './logics/permissions.logic';
import { StudentRepository } from 'src/student/entities/repositories/student.repository';

@Injectable()
export class AuthService {
  constructor(
    private expertRepo: ExpertRepository,
    private managerRepo: ManagerRepository,
    private teacherRepo: TeacherRepository,
    private studentRepo: StudentRepository,
    private userHasPermissionRepo: UserHasPermissionRepository,
  ) {}

  getPermissions() {
    return Object.keys(PermissionsEnum);
  }

  async assignPermissions(
    permissions: PermissionsEnum[],
    modelId: number,
    modelType: RolesEnum,
  ) {
    if (modelType === RolesEnum.EXPERT) {
      await this.expertRepo.findOneByIdOrFail(modelId);
    }

    if (modelType === RolesEnum.MANAGER) {
      await this.managerRepo.findOneByIdOrFail(modelId);
    }

    if (modelType === RolesEnum.TEACHER) {
      await this.teacherRepo.findOneByIdOrFail(modelId);
    }

    if (modelType === RolesEnum.STUDENT) {
      await this.teacherRepo.findOneByIdOrFail(modelId);
    }

    this.userHasPermissionRepo.createBulk(
      createUserHasPermModel(permissions, modelId, modelType),
    );
  }

  async loginStudent(loginDto: StudentLoginDto): Promise<{ token: string }> {
    try {
      const student = await this.studentRepo.findOne({
        where: { ...loginDto },
        include: [
          {
            model: UserHasPermissionModel,
            as: 'permissions',
          },
        ],
      });

      if (!student) {
        throw '';
      }

      const token = await loginLogic(
        loginDto.nationalCode,
        loginDto.password,
        student.permissions?.map((p: UserHasPermission) => p.permission) || [],
        RolesEnum.STUDENT,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('username or password incorrect');
    }
  }

  async loginTeacher(loginDto: TeachertLoginDto): Promise<{ token: string }> {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: { ...loginDto },
        include: [
          {
            model: UserHasPermissionModel,
            as: 'permissions',
          },
        ],
      });

      if (!teacher) {
        throw '';
      }

      const token = await loginLogic(
        loginDto.nationalCode,
        loginDto.password,
        teacher.permissions?.map((p: UserHasPermission) => p.permission) || [],
        RolesEnum.TEACHER,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('username or password incorrect');
    }
  }

  async loginExpert(loginDto: ExpertLoginDto): Promise<{ token: string }> {
    try {
      const expert = await this.expertRepo.findOne({
        where: { ...loginDto },
        include: [
          {
            model: UserHasPermissionModel,
            as: 'permissions',
          },
        ],
      });

      if (!expert) {
        throw '';
      }

      const token = await loginLogic(
        loginDto.nationalCode,
        loginDto.password,
        expert.permissions?.map((p: UserHasPermission) => p.permission) || [],
        RolesEnum.EXPERT,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('username or password incorrect');
    }
  }

  async loginManager(loginDto: ManagerLoginDto): Promise<{ token: string }> {
    try {
      const manager = await this.managerRepo.findOne({
        where: { ...loginDto },
        include: [
          {
            model: UserHasPermissionModel,
            as: 'permissions',
          },
        ],
      });

      if (!manager) {
        throw '';
      }

      const token = await loginLogic(
        loginDto.nationalCode,
        loginDto.password,
        manager.permissions?.map((p: UserHasPermission) => p.permission) || [],
        RolesEnum.MANAGER,
      );
      return { token };
    } catch {
      throw new UnauthorizedException('username or password incorrect');
    }
  }
}
