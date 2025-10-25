import { NestFactory } from '@nestjs/core';
import yargs from 'yargs';
import glob from 'fast-glob';
import { Command } from './types/command.type';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const y = yargs(process.argv.slice(2)).help();

  const commandFiles = await glob('src/**/*.command.ts');

  for (const file of commandFiles) {
    const command: Command = (await import(`${file}`)).command;

    const argv = await y
      .command(command.cmd, command.describe || '', command.flags || {})
      .parse();

    await command.runner(appContext, argv);
  }

  y.demandCommand().strict().parse();
  await appContext.close();
}

bootstrap();
