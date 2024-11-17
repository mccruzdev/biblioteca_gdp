import { IsString } from 'class-validator';
import { IsValidPassword } from 'src/decorators/validators/is-valid-password/is-valid-password.decorator';

export class ConfirmPasswordChange {
  @IsString()
  token: string;

  @IsString()
  @IsValidPassword({
    message:
      'La contraseña debe tener entre 8 y 70 caracteres, no exceder los 72 bytes, y contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo.',
  })
  password: string;
}
