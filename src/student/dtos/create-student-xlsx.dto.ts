import { z } from 'zod';

export const createStudentXlsxDtoSchema = z
  .object({
    certificateNumber: z
      .string()
      .trim()
      .min(5)
      .or(z.number().min(1))
      .transform((v) => v + ''),
    fileNumber: z.number().min(1),
    admissionNumber: z.number().min(1),
    interviewCode: z.number().min(1),
    lastUniversityName: z.string().trim().min(1),
    lastUniversityCode: z.number().min(1),
    degreeIssuedDate: z
      .string()
      .trim()
      .min(7)
      .max(8)
      .or(z.number())
      .transform((v) => v + '')
      .transform((v) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`),
    lastFieldOfStudyCode: z.number().min(1),
    lastFieldOfStudyCodeName: z.string().trim().min(1),
    gpa: z.number().min(1),
    resistanceCityCode: z.number().min(1),
    resistanceCityName: z.string().trim().min(1),
    examFieldStudyCode: z.number().min(1),
    examFieldStudyName: z.string().trim().min(1),
    fieldOfStudyId: z.number().min(1),
    quotaType: z.string().trim().min(1),
    totalGrade: z.number().min(1),
    status: z.number().min(1),
    period: z.number().min(1),
    interviewUniversityCode: z.number().min(1),
    interviewUniversityName: z.string().trim().min(1),
    certificateIssuedPlaceCode: z.number().min(1),
    certificateIssuedPlaceName: z.string().trim().min(1),
    birthPlaceCode: z.number().min(1),
    birthPlaceName: z.string().trim().min(1),
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    phone: z
      .string()
      .trim()
      .min(1)
      .or(z.number().min(1))
      .transform((v) => v + ''),
    password: z
      .string()
      .trim()
      .min(1)
      .or(z.number().min(1))
      .transform((v) => v + ''),
    nationalCode: z
      .string()
      .trim()
      .min(1)
      .or(z.number().min(1))
      .transform((v) => v + ''),
    birthOfDate: z
      .string()
      .trim()
      .min(7)
      .max(8)
      .or(z.number())
      .transform((v) => v + '')
      .transform((v) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`),
    fatherName: z.string().trim().min(1),
    gender: z
      .literal(1)
      .or(z.literal(2))
      .transform((v) => (v === 1 ? 'MALE' : 'FEMALE')),
  })
  .required();

export type CreateStudentXlsxDto = Required<
  z.infer<typeof createStudentXlsxDtoSchema>
>;
