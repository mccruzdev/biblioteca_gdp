import {
  IsString,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe tener 8 dígitos numéricos.',
  })
  dni: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,70}$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un símbolo y tener al menos 8 caracteres.',
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
