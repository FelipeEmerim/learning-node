import { Type } from 'class-transformer';
import { IsInt, IsNumberString } from 'class-validator';

export class IdSchema {
  @Type(() => Number)
  @IsInt()
  id: number;
}
