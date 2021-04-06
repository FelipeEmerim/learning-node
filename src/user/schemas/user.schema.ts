import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UserSchema {
  @IsString()
  @Length(5, 100)
  firstName: string;

  @IsString()
  @Length(5, 100)
  lastName: string;

  @IsString()
  @Length(5, 500)
  password: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
