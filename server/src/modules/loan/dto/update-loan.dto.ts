import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDate,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { LoanStatusE } from 'src/types';

export class UpdateLoanDTO {
  @IsDate({ message: 'The dueDate field must be a valid date.' })
  @Type(() => Date)
  dueDate: Date;

  @IsEnum(LoanStatusE, {
    message: 'The status field must be a valid LoanStatus value.',
  })
  status: LoanStatusE;

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
