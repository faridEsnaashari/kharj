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

export const dateTimeDtoSchema = z.stringFormat('date-time-dto', (v) => {
  const date = v.split(' ')[0];
  const time = v.split(' ')[1];

  const hour = time.split(':')[0];
  const min = time.split(':')[1];
  const sec = time.split(':')[2];

  if (
    hour?.length !== 2 ||
    !(+hour >= 0) ||
    min?.length !== 2 ||
    !(+min >= 0) ||
    sec?.length !== 2 ||
    !(+sec >= 0)
  ) {
    return false;
  }

  const year = date.split('-')[0];
  const month = date.split('-')[1];
  const day = date.split('-')[2];

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

export type DateTimeDto = z.infer<typeof dateTimeDtoSchema>;
