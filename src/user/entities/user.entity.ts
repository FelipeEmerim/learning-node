import {
  EntityRepositoryType,
  PrimaryKey,
  Entity,
  Property,
} from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';
// eslint-disable-next-line import/no-cycle
import { UserRepository } from '../repositories/user.repository';

@Entity({ tableName: 'users' })
@Exclude()
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  @Expose()
  id: number;

  @Property({ name: 'first_name', type: 'text' })
  @Expose()
  firstName: string;

  @Property({ name: 'last_name', type: 'text' })
  @Expose()
  lastName: string;

  @Property({ name: 'password', type: 'text' })
  @Expose()
  password: string;

  @Property({ name: 'is_active', default: true })
  @Expose()
  isActive = true;

  @Property({
    name: 'created_at',
    columnType: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onCreate: () => new Date(new Date().toUTCString()),
  })
  @Expose()
  createdAt = new Date(new Date().toUTCString());

  @Property({
    name: 'updated_at',
    columnType: 'timestamptz',
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(new Date().toUTCString()),
  })
  @Expose()
  updatedAt = new Date(new Date().toUTCString());
}
