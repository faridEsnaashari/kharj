import { Command } from '../types/command.type';
import fs from 'fs';
import path from 'path';

export const command: Command = {
  runner: async function (appContext, argv) {
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1);
    const lowerFirst = (str: string) =>
      str.charAt(0).toLowerCase() + str.slice(1);
    const kebabCase = (str: string) =>
      str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();

    let moduleName = argv.name as string;
    moduleName = moduleName
      .split('')
      .map((i, index) => (index === 0 ? i.toUpperCase() : i))
      .join('');

    if (!moduleName) {
      return { isSuccess: false, error: 'Module name is required' };
    }

    const dirName = kebabCase(moduleName);
    const baseDir = path.resolve('src', dirName);

    // Helpers
    const mkdir = (dir: string) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    };
    const writeFile = (filePath: string, content: string) => {
      if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, content);
    };
    const fileName = kebabCase(moduleName);
    const variableName = lowerFirst(moduleName);

    // 1️⃣ Create folder structure
    mkdir(baseDir);
    mkdir(path.join(baseDir, 'dtos'));
    mkdir(path.join(baseDir, 'entities'));
    mkdir(path.join(baseDir, 'entities', 'repositories'));
    mkdir(path.join(baseDir, 'logics'));

    // 2️⃣ entity
    writeFile(
      path.join(baseDir, 'entities', `${fileName}.entity.ts`),
      `import {
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

export type ${capitalize(moduleName)} = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Create${capitalize(moduleName)} = CreateEntity<${capitalize(moduleName)}>;
export type Update${capitalize(moduleName)} = UpdateEntity<${capitalize(moduleName)}>;  

@Table({ tableName: '${fileName}s', underscored: true })
export class ${capitalize(moduleName)}Model extends Model<${capitalize(moduleName)}, Create${capitalize(moduleName)}> implements ${capitalize(moduleName)} {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: string;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: string;
}`,
    );

    // 3️⃣ repository
    writeFile(
      path.join(
        baseDir,
        'entities',
        'repositories',
        `${fileName}.repository.ts`,
      ),
      `import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ${capitalize(moduleName)}, ${capitalize(moduleName)}Model, Create${capitalize(moduleName)}, Update${capitalize(moduleName)} } from '../${fileName}.entity';
import { CommonRepository } from 'src/common/ports/database/common-repository/common-repository';

@Injectable()
export class ${capitalize(moduleName)}Repository extends CommonRepository<
  ${capitalize(moduleName)},
  Create${capitalize(moduleName)},
  Update${capitalize(moduleName)},
  ${capitalize(moduleName)}Model
> {
  constructor(@InjectModel(${capitalize(moduleName)}Model) model: typeof ${capitalize(moduleName)}Model) {
    super(model);
  }
}
`,
    );
    // 4️⃣ service
    writeFile(
      path.join(baseDir, `${fileName}.service.ts`),
      `import { Injectable } from '@nestjs/common';
import { ${capitalize(moduleName)}Repository } from './entities/repositories/${fileName}.repository';

@Injectable()
export class ${capitalize(moduleName)}Service {
  constructor(private ${variableName}Repository: ${capitalize(moduleName)}Repository) {}

  async findOne${capitalize(moduleName)}(id: number) {
    return this.${variableName}Repository.findOneById(id);
  }
}`,
    );

    // 5️⃣ controller
    writeFile(
      path.join(baseDir, `${fileName}.controller.ts`),
      `import { Controller, Get, Param } from '@nestjs/common';
import { ${capitalize(moduleName)}Service } from './${fileName}.service';

@Controller('${fileName}')
export class ${capitalize(moduleName)}Controller {
  constructor(private ${variableName}Service: ${capitalize(moduleName)}Service) {}

  @Get(':id')
  async findOne${capitalize(moduleName)}(@Param('id') id: number) {
    return this.${variableName}Service.findOne${capitalize(moduleName)}(id);
  }
}`,
    );

    // 6️⃣ module
    writeFile(
      path.join(baseDir, `${fileName}.module.ts`),
      `import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ${capitalize(moduleName)}Controller } from './${fileName}.controller';
import { ${capitalize(moduleName)}Model } from './entities/${fileName}.entity';
import { ${capitalize(moduleName)}Service } from './${fileName}.service';
import { ${capitalize(moduleName)}Repository } from './entities/repositories/${fileName}.repository';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  //imports: [SequelizeModule.forFeature([${capitalize(moduleName)}Model]), AuthModule],
  imports: [SequelizeModule.forFeature([${capitalize(moduleName)}Model])],
  providers: [${capitalize(moduleName)}Service, ${capitalize(moduleName)}Repository],
  controllers: [${capitalize(moduleName)}Controller],
})
export class ${capitalize(moduleName)}Module {}`,
    );

    return { isSuccess: true, error: null };
  },

  cmd: 'create-new-module',
  describe: 'Creates a new NestJS module with standard structure',
  flags: {
    name: {
      string: true,
      alias: 'n',
      describe: 'name of the module to be created',
      demandOption: true,
    },
  },
};
