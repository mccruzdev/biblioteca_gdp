import { IsString, Matches } from 'class-validator';

export class RefreshTokenDTO {
  @Matches(/^\d{8}$/, {
    message: 'DNI must have 8 numeric digits.',
  })
  dni: string;

  @IsString()
  password: string;
}
