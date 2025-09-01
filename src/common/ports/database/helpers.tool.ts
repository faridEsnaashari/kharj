import { Op, WhereOptions } from 'sequelize';

export function createSearchObject<T>(
  q: string,
  searchKeys: (keyof T)[],
): WhereOptions<T> {
  const searchObjects = searchKeys.map((s) => ({
    [s]: { [Op.like]: `%${q}%` },
  }));

  return {
    [Op.or]: [...searchObjects],
  } as WhereOptions<T>;
}
