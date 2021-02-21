import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@Exclude()
export class UserSchema {
  @Expose()
  @IsString()
  @Length(5, 100)
  firstName: string;

  @Expose()
  @IsString()
  @Length(5, 100)
  lastName: string;

  @Expose()
  @IsString()
  @Length(5, 500)
  password: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
