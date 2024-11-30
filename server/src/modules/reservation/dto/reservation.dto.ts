import {
  IsDate,
  IsEnum,
  ArrayNotEmpty,
  IsInt,
  Min,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatusE } from 'src/types';

export class ReservationDTO {
  @IsDate({ message: 'The dueDate field must be a valid date.' })
  @Type(() => Date)
  dueDate: Date;

  @IsEnum(ReservationStatusE, {
    message: 'The status field must be a valid ReservationStatus value.',
  })
  status: ReservationStatusE;

  @ArrayNotEmpty({ message: 'The copies field must not be empty.' })
  @ArrayUnique({ message: 'The copies field must contain unique values.' })
  @IsInt({
    each: true,
    message: 'Each value in the copies field must be an integer.',
  })
  @Min(1, {
    each: true,
    message:
      'Each value in the copies field must be greater than or equal to 1.',
  })
  copies: number[];
}
