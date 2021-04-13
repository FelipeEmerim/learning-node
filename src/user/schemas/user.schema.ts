import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class UserSchema {
  @IsString()
  @Length(5, 100)
  @Expose()
  firstName: string;

  @IsString()
  @Length(5, 100)
  @Expose()
  lastName: string;

  @IsString()
  @Length(5, 500)
  @Expose()
  password: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive = true;
}
