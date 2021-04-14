import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorMessageSchema {
  @ApiProperty({
    example: {
      id: 1,
      firstName: 'su',
    },
    description: 'The object that was validated',
  })
  target?: object;

  @ApiProperty({
    example: 'firstName',
    description: 'The property that failed validation',
  })
  property: string;

  @ApiProperty({
    example: 'su',
    description: 'The value of the property that failed validation',
  })
  value?: unknown;

  @ApiProperty({
    description: 'The constraint that failed validation',
    example: {
      isLength: 'firstName must be longer than or equal to 5 characters',
    },
  })
  constraints?: {
    [type: string]: string;
  };

  @ApiProperty({
    type: () => [ValidationErrorMessageSchema],
    description: 'In case of a complex object, display child validation errors',
  })
  children?: ValidationErrorMessageSchema[];

  contexts?: {
    [type: string]: never;
  };
}
