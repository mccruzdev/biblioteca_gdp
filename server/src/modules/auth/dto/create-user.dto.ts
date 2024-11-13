import {
  IsString,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { IsValidPassword } from 'src/decorators/validators/is-valid-password/is-valid-password.decorator';

export class CreateUserDTO {
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe tener 8 dígitos numéricos.',
  })
  dni: string;

  @IsString()
  @IsValidPassword({
    message:
      'La contraseña debe tener entre 8 y 70 caracteres, no exceder los 72 bytes, y contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo.',
  })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message:
      'El nombre solo puede contener letras, espacios y caracteres con acento.',
  })
  names: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message:
      'El apellido solo puede contener letras, espacios y caracteres con acento.',
  })
  lastName: string;

  @IsOptional()
  @Matches(/^\d{9}$/, {
    message: 'El número de teléfono debe tener exactamente 9 dígitos.',
  })
  phoneNumber?: string;
}
