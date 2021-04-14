import { ApiProperty } from '@nestjs/swagger';
import { ValidationErrorMessageSchema } from './validation-error-message.schema';

export class ValidationErrorSchema {
  @ApiProperty({
    example: 422,
    description: 'Indicate the status code of the error',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unprocessable entity',
    description: 'Indicate the error type',
  })
  error: string;

  @ApiProperty({
    type: () => [ValidationErrorMessageSchema],
    description: 'Indicate the constraints that were violated',
  })
  message: ValidationErrorMessageSchema[];
}
