export interface Repository<T> {
  findAll(): Promise<T[]>;
  findOneOrFail(id: number): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(values: T): Promise<T>;
  delete(id: T): Promise<void>;
}
