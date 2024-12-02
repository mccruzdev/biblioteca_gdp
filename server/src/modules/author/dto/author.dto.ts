import { IsOptional, IsString, Length } from 'class-validator';

export class AuthorDTO {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(5, 100)
  email?: string;
}
