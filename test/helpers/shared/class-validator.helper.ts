import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ClassValidatorHelper {
  static checkConstraintFoundOnProperty(
    exception: BadRequestException,
    property: string,
    constraint: string,
  ): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = exception.getResponse();
    const errors: ValidationError[] = response.message;

    const propertyErrors = errors.filter((value) => {
      return value.property === property;
    });

    if (!propertyErrors.length) {
      return false;
    }

    const error = propertyErrors[0];

    return Object.prototype.hasOwnProperty.call(error.constraints, constraint);
  }
}
