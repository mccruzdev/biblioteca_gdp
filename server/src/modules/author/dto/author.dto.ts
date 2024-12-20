import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class AuthorDTO {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
