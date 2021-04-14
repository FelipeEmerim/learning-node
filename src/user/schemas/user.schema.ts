import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { boolean, string } from 'joi';

@Exclude()
export class UserSchema {
  @IsString()
  @Length(5, 100)
  @Expose()
  @ApiProperty({
    example: 'Robert',
    description: 'The first name of the user',
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

  @IsString()
  @Length(5, 500)
  @Expose()
  @ApiProperty({
    example: 'not 123456',
    description: 'The password of the user',
    minLength: 5,
    maxLength: 500,
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    type: boolean,
    default: true,
    example: true,
    description: 'Indicate if the user is active',
  })
  isActive = true;
}
