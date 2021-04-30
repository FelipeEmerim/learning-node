import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class CatSchema {
  @IsString()
  @Length(5, 100)
  @Expose()
  @ApiProperty({
    example: 'Robert',
    description: 'The name of the cat',
    minLength: 5,
    maxLength: 100,
  })
  name: string;

  @IsString()
  @Length(5, 100)
  @Expose()
  @ApiProperty({
    example: 'Garcia',
    description: 'The description of the cat',
    minLength: 5,
    maxLength: 100,
  })
  description: string;

  @IsBoolean()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    default: true,
    example: true,
    description: 'Indicate if the cat is active',
  })
  isActive = true;
}
