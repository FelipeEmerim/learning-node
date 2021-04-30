export interface Repository<T> {
  find(): Promise<T[]>;
  findOneOrFail(id: string): Promise<T>;
  findOne(id: string): Promise<T | null>;
  save(values: object): Promise<T>;
  delete(id: string): Promise<void>;
}
