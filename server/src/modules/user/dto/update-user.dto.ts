import { IsBoolean, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { RolesE } from 'src/types';

export class UpdateUserDTO {
  @IsEmail({}, { message: 'El correo electrónico debe ser un formato válido.' })
  @IsOptional()
  email?: string;

  @IsEnum(RolesE, { message: 'El rol debe ser un valor válido.' })
  @IsOptional()
  role?: RolesE;

  @IsBoolean({ message: 'isDisabled debe ser un valor booleano.' })
  @IsOptional()
  isDisabled?: boolean;

  @IsBoolean({ message: 'emailVerified debe ser un valor booleano.' })
  @IsOptional()
  emailVerified?: boolean;
}
