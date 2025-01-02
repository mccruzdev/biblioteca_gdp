import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';

export class ReservationToLoanDTO {
  @IsInt()
  reservationId: number;

  @IsDate({ message: 'The dueDate field must be a valid date.' })
  @Type(() => Date)
  dueDate: Date;

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
