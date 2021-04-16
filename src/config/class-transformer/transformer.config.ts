import { ClassTransformOptions } from 'class-transformer';

const classTransformOptions: ClassTransformOptions = {
  enableImplicitConversion: true,
  exposeDefaultValues: true,
  excludeExtraneousValues: true,
};

export default classTransformOptions;
