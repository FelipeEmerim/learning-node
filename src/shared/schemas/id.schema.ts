import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdSchema {
  @IsUUID(4)
  @ApiProperty({
    example: '7ef3c0ba-03d7-49e4-8d83-7b7b6c8eb929',
    description: 'Indicate the id of the user',
  })
  id: string;
}
