import { Logger } from 'src/common/tools/pino/logger.tool';
import { createStudentXlsxDtoSchema } from 'src/student/dtos/create-student-xlsx.dto';
import { CreateStudent } from 'src/student/entities/student.entity';

export function mapAdmissionXlsxToStudent(
  data: Record<string, undefined | number | string>[],
):
  | {
      students: CreateStudent[];
      wrongFormats: { fileNumber: number; path: string[] }[];
    }
  | false {
  try {
    const students: CreateStudent[] = [];
    const wrongFormats: { fileNumber: number; path: string[] }[] = [];

    data
      .map((d) => ({
        certificateNumber: d['شماره شناسنامه'],
        fileNumber: d['شماره پرونده'],
        admissionNumber: d['شماره طاوطلب'],
        interviewCode: d['کد مصاحبه'],
        lastUniversityName: d['نام دانشگاه اخذ مدرک'],
        lastUniversityCode: d['دانشگاه اخذ مدرک'],
        degreeIssuedDate: d['تاریخ اخذ مدرک'],
        lastFieldOfStudyCode: d['رشته تحصیلی'],
        lastFieldOfStudyCodeName: d['نام رشته تحصیلی'],
        gpa: d['معدل'],
        resistanceCityCode: d['کد محل اقامت'],
        resistanceCityName: d['شهر اقامت'],
        examFieldStudyCode: d['کد رشته امتحانی'],
        examFieldStudyName: d['نام رشته امتحانی'],
        fieldOfStudyId: d['کد رشته محل(رشته امتحانی داوطلب)'],
        quotaType: d['سهمیه'],
        totalGrade: d['نمره کل'],
        status: d['وضع'],
        period: d['دوره'],
        interviewUniversityCode: d['کد دانشگاه مصاحبه'],
        interviewUniversityName: d['نام دانشگاه مصاحبه'],
        certificateIssuedPlaceCode: d['کد محل صدور شناسنامه'],
        certificateIssuedPlaceName: d['نام محل صدور شناسنامه'],
        birthPlaceCode: d['بخش تولد'],
        birthPlaceName: d['شهر تولد'],
        firstName: d['نام'],
        lastName: d['نام خانوادگی'],
        phone: d['موبایل'],
        password: d['شماره طاوطلب'],
        nationalCode: d['کد ملی'],
        birthOfDate: d['تاریخ تولد'],
        fatherName: d['نام پدر'],
        gender: d['جنس'],
      }))
      .forEach((d) => {
        const parsedData = createStudentXlsxDtoSchema.safeParse(d);

        if (parsedData.success) {
          students.push(parsedData.data);
          return;
        }

        wrongFormats.push({
          fileNumber: d.fileNumber as number,
          path:
            parsedData.error?.issues.map((i) => i.path + '') || 'unknown_field',
        });
      });

    return { students, wrongFormats };
  } catch (err) {
    const l = new Logger('MANAGER_LOGIC_ERROR');
    l.error({ key: 'MAP_ADMISSION_XLSX_TO_STUENDENT', data: err });
    return false;
  }
}
