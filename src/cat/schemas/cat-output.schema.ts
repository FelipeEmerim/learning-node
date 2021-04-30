import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CatOutputSchema {
  @Expose()
  @Type(() => Number)
  @ApiProperty({
    description: 'The id of the cat',
    example: 1,
  })
  readonly id: number;

  @Expose()
  @ApiProperty({
    description: 'The name of the cat',
    example: 'Robert',
  })
  readonly name: string;

  @Expose()
  @ApiProperty({
    description: 'The description of the cat',
    example: 'Garcia',
  })
  readonly description: string;

  @Expose()
  @ApiProperty({
    description: 'Indicate if the cat is active',
    example: true,
  })
  readonly isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'The date the cat was created',
    example: new Date(),
  })
  readonly createdAt: string;

  @Expose()
  @ApiProperty({
    description: 'The date the cat was updated',
    example: new Date(),
  })
  readonly updatedAt: string;
}
