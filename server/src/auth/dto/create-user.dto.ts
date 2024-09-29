import {
  IsString,
  Matches,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @Matches(/^\d{8}$/, {
    message: 'DNI must have 8 numeric digits.',
  })
  dni: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'password must contain at least one uppercase letter, one lowercase letter, one number, one symbol, and be at least 8 characters long.',
  })
  password: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address.' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'first name cannot be empty.' })
  names: string;

  @IsString()
  @IsNotEmpty({ message: 'last name cannot be empty.' })
  lastName: string;

  @IsOptional()
  @Matches(/^\d{9}$/, {
    message: 'phone number must have exactly 9 digits.',
  })
  phoneNumber?: string;
}
