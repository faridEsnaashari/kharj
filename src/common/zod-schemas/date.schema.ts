import z from 'zod';

export const dateDtoSchema = z.stringFormat('date-dto', (v) => {
  const year = v.split('-')[0];
  const month = v.split('-')[1];
  const day = v.split('-')[2];

  if (
    year?.length !== 4 ||
    !(+year > 0) ||
    month?.length !== 2 ||
    !(+month > 0) ||
    day?.length !== 2 ||
    !(+day > 0)
  ) {
    return false;
  }

  return true;
});

export type DateDto = z.infer<typeof dateDtoSchema>;
