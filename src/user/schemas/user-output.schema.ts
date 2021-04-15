import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserOutputSchema {
  @Expose()
  @Type(() => Number)
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
  })
  readonly id: number;

  @Expose()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Robert',
  })
  readonly firstName: string;

  @Expose()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Garcia',
  })
  readonly lastName: string;

  @Expose()
  @ApiProperty({
    description: 'Indicate if the user is active',
    example: true,
  })
  readonly isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'Indicate the date the user was created',
    example: new Date(),
  })
  readonly createdAt: boolean;

  @Expose()
  @ApiProperty({
    description: 'Indicate the date the user was last updated',
    example: new Date(),
  })
  readonly updatedAt: boolean;
}
