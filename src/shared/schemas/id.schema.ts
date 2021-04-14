import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class IdSchema {
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'Indicate the id of the user',
  })
  id: number;
}
