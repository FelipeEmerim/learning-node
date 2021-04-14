import { ApiProperty } from '@nestjs/swagger';

export class ErrorSchema {
  @ApiProperty({
    example: 404,
    description: 'The http error code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Not Found',
    description: 'The description of the http error',
  })
  error: string;

  @ApiProperty({
    example: 'Cannot GET /not-found-route',
    description: 'The description of the http error',
  })
  message: string;
}
