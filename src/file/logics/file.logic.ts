import { appConfigs } from 'src/app.configs';
import * as fs from 'fs';
import * as path from 'node:path';
import { generateRandomNumber } from 'src/common/tools/random.tool';
import { Logger } from 'src/common/tools/pino/logger.tool';
import { SavedFile } from './file.logic.type';

export function createRandomFileName(id: number) {
  return `${id}-${Date.now()}-${generateRandomNumber()}`;
}

export function getFileName(originFileName: string, id: number = 0) {
  return `${createRandomFileName(id)}.${originFileName.split('.').reverse()[0]}`;
}

export function getFileUrl(fileName: string) {
  return `${appConfigs.appBaseUrl}${fileName.split('uploads').reverse()[0]}`;
}

function saveFile(
  fileName: string,
  file: NodeJS.ArrayBufferView,
  filePath = '',
): Promise<SavedFile> {
  const pthWithFilename = path.resolve(filePath, fileName);
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  return new Promise((res, rej) => {
    fs.writeFile(pthWithFilename, file, (err) => {
      if (err) {
        const logger = new Logger('bootstrap');
        logger.log({
          key: 'MAIN',
          data: { msg: 'app started on port ' + appConfigs.appPort },
        });

        rej({ fileName: '', filePath: '' });
        return;
      }

      res({ fileName: fileName, filePath, pathWithName: pthWithFilename });
    });
  });
}

export function saveTempPublicFile(
  fileName: string,
  file: NodeJS.ArrayBufferView,
): Promise<SavedFile> {
  return saveFile(fileName, file, path.resolve('./public/', 'temps'));
}

export function saveUploadedFile(
  fileName: string,
  file: NodeJS.ArrayBufferView,
  filePath = '',
): Promise<SavedFile> {
  return saveFile(fileName, file, path.resolve('./uploads/', filePath));
}

export async function readUploadedFile(
  filePath: string,
): Promise<NodeJS.ArrayBufferView> {
  return readFile(path.resolve('./uploads/', filePath));
}

export async function readFile(
  filePath: string,
): Promise<NodeJS.ArrayBufferView> {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        rej(err);
        return;
      }

      res(data);
    });
  });
}

export async function makeFilePublic(filePath: string) {
  const file = await readFile(filePath);

  const tmpFile = await saveTempPublicFile(
    getFileName(`file.${filePath.split('.').reverse()[0]}`),
    file,
  );

  if (tmpFile.fileName === '') {
    return '';
  }

  return getFileUrl(tmpFile.fileName);
}
