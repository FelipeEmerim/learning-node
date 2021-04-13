import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class UserUpdateSchema {
  @Exclude({ toClassOnly: true })
  id: number;

  @IsString()
  @Length(5, 100)
  @Expose()
  firstName: string;

  @IsString()
  @Length(5, 100)
  @Expose()
  lastName: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive = true;
}
