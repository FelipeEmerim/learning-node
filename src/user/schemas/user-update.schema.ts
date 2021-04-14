import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class UserUpdateSchema {
  @Exclude()
  @ApiHideProperty()
  id: number;

  @IsString()
  @Length(5, 100)
  @Expose()
  @ApiProperty({
    example: 'Garcia',
    description: 'The last name of the user',
    minLength: 5,
    maxLength: 100,
  })
  firstName: string;

  @IsString()
  @Length(5, 100)
  @Expose()
  @ApiProperty({
    example: 'Garcia',
    description: 'The last name of the user',
    minLength: 5,
    maxLength: 100,
  })
  lastName: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    default: true,
    example: true,
    description: 'Indicate if the user is active',
  })
  isActive = true;
}
