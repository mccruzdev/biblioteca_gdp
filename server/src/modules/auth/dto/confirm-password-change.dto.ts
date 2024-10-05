import { IsString, Matches } from 'class-validator';

export class ConfirmPasswordChange {
  @IsString()
  token: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, one symbol, and be at least 8 characters long.',
  })
  password: string;
}
