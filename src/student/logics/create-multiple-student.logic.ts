import { Logger } from 'src/common/tools/pino/logger.tool';
import { CreateStudent, Student } from '../entities/student.entity';

export async function createMultipleStudent(
  students: CreateStudent[],
  createStudent: (student: CreateStudent) => Promise<Student>,
): Promise<{ fileNumber: number; path: ['duplicated'] }[]> {
  const duplicated: number[] = [];

  for (const s of students) {
    try {
      await createStudent(s);
    } catch (err) {
      const l = new Logger('STUDENT_LOGIC_ERROR');
      l.error({ key: 'STUDENT_CREATE_ERROR', data: err });
      duplicated.push(s.fileNumber);
    }
  }

  return duplicated.map((d) => ({ fileNumber: d, path: ['duplicated'] }));
}
