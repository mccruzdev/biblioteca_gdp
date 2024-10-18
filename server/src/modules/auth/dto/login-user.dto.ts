import { IsString, Matches } from 'class-validator';

export class LoginUserDTO {
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe tener 8 dígitos numéricos.',
  })
  dni: string;

  @IsString()
  password: string;
}
