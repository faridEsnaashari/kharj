export type CreateEntity<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateEntity<T> = Partial<Omit<T, 'id'>>;
