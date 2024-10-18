import { Matches } from 'class-validator';

export class PasswordChangedDTO {
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe tener 8 dígitos numéricos.',
  })
  dni: string;
}
