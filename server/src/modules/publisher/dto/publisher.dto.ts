import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class PublisherDTO {
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres.' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'El país debe tener entre 2 y 100 caracteres.' })
  country?: string;

  @IsOptional()
  @IsString()
  @Length(5, 200, {
    message: 'La dirección debe tener entre 5 y 200 caracteres.',
  })
  address?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'El número de teléfono no es válido.' })
  phoneNumber?: string;

  @IsOptional()
  @IsUrl({}, { message: 'El sitio web debe ser una URL válida.' })
  website?: string;
}
