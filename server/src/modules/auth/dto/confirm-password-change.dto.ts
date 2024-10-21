import { IsString, Matches } from 'class-validator';

export class ConfirmPasswordChange {
  @IsString()
  token: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un símbolo y tener al menos 8 caracteres.',
  })
  password: string;
}
