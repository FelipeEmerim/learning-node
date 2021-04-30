import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CatOutputSchema {
  @Expose()
  @ApiProperty({
    description: 'The id of the cat',
    example: '7ef3c0ba-03d7-49e4-8d83-7b7b6c8eb929',
  })
  readonly id: string;

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
