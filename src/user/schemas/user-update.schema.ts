import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UserUpdateSchema {
  id: number;

  @IsString()
  @Length(5, 100)
  firstName: string;

  @IsString()
  @Length(5, 100)
  lastName: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
