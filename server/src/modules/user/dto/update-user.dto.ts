import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RolesE } from 'src/types';

export class UpdateUserDTO {
  @IsEnum(RolesE, { message: 'El rol debe ser un valor válido.' })
  @IsOptional()
  role: RolesE;

  @IsBoolean({ message: 'isDisabled debe ser un valor booleano.' })
  @IsOptional()
  isDisabled: boolean;
}
