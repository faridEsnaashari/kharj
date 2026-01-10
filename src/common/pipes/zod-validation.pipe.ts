import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    if (value === undefined) {
      return;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (err) {
      throw new BadRequestException({ message: 'VALIDATION_ERROR', err });
    }
  }
}
