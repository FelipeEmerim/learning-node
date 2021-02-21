import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserOutputSchema {
  @Expose()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly isActive: boolean;
}
