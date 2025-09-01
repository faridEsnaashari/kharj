import { appConfigs } from 'src/app.configs';
import { getRandomNumber } from 'src/common/tools/random.tool';
import * as fs from 'fs';
import * as path from 'node:path';

export function createRandomFileName(id: number) {
  return `${id}-${Date.now()}-${getRandomNumber()}`;
}

export function getFileName(originFileName: string, id: number = 0) {
  return `${createRandomFileName(id)}.${originFileName.split('.').reverse()[0]}`;
}

export function getFileUrl(fileName: string) {
  return `${appConfigs.appBaseUrl}${fileName.split('public').reverse()[0]}`;
}

function saveFile(
  fileName: string,
  file: NodeJS.ArrayBufferView,
  filePath = '',
): Promise<string> {
  const pthWithFilename = path.resolve(filePath, fileName);
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  return new Promise((res, rej) => {
    fs.writeFile(pthWithFilename, file, (err) => {
      if (err) {
        rej(err);
        return;
      }

      res(pthWithFilename);
    });
  });
}

export function saveTempPublicFile(
  fileName: string,
  file: NodeJS.ArrayBufferView,
): Promise<string> {
  return saveFile(fileName, file, path.resolve('./public/', 'temps'));
}

export function saveUploadedFile(
  fileName: string,
  file: NodeJS.ArrayBufferView,
  filePath = '',
) {
  return saveFile(fileName, file, path.resolve('./uploads/', filePath));
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

  return getFileUrl(tmpFile);
}
