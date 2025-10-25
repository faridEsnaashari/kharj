import { INestApplicationContext } from '@nestjs/common';
import { Options } from 'yargs';

export type Command = {
  runner: (
    appContext: INestApplicationContext,
    ...args: { [key: string]: unknown }[]
  ) => Promise<{
    isSuccess: boolean;
    error: object | string | null;
  }>;

  cmd: string;

  describe: string;

  flags?: {
    [key: string]: Options;
  };
};
