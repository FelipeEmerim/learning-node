import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@Exclude()
export class UserSchema {
  @Expose({ toPlainOnly: true })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly id: number;

  @Expose()
  @IsString()
  @Length(5, 100)
  firstName: string;

  @Expose()
  @IsString()
  @Length(5, 100)
  lastName: string;

  @Expose({ toClassOnly: true })
  @IsString()
  @Length(5, 500)
  password: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
