import { Matches } from 'class-validator';

export class PassworChangedDTO {
  @Matches(/^\d{8}$/, {
    message: 'DNI must have 8 numeric digits.',
  })
  dni: string;
}
