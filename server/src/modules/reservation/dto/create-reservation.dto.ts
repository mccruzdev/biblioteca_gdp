import {
  IsDate,
  ArrayNotEmpty,
  IsInt,
  Min,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDTO {
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
