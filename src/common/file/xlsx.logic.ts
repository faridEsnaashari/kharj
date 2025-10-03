import * as xlsx from 'xlsx';
import { Logger } from '../tools/pino/logger.tool';
import { saveTempPublicFile } from './files.logic';
import { generateRandomNumber } from '../tools/random.tool';

export function xlsxToJson<T>(filePath: string): T[] | false {
  try {
    const workBook = xlsx.readFile(filePath);

    const sheet = workBook.Sheets[workBook.SheetNames[0]];

    const json = xlsx.utils.sheet_to_json(sheet);

    return json as T[];
  } catch (err) {
    const logger = new Logger('XLSX_EXCEPTION');
    logger.error({ key: 'XLSX_TO_JSON_EXCEPTION', data: err });

    return false;
  }
}

export async function jsonToXlsx(data: unknown[]): Promise<string | false> {
  try {
    const worksheet = xlsx.utils.json_to_sheet(data);

    const workbook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workbook, worksheet);

    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const fileName = Date.now() + '' + generateRandomNumber(10) + '.xlsx';
    return saveTempPublicFile(fileName, buffer);
  } catch (err) {
    const logger = new Logger('XLSX_EXCEPTION');
    logger.error({ key: 'JSON_TO_XLSX_EXCEPTION', data: err });

    return false;
  }
}
