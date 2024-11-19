import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  Length,
  IsPhoneNumber,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDTO } from 'src/modules/location/dto/location.dto';
import { BookConditionE } from 'src/types';

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

export class CopyDto {
  @IsOptional()
  @IsString({ message: 'The code field must be a string.' })
  code?: string;

  @IsNotEmpty({ message: 'The condition field is required.' })
  @IsEnum(BookConditionE, {
    message: `The condition field must be one of the following: ${Object.values(BookConditionE).join(', ')}.`,
  })
  condition: BookConditionE;

  @IsNotEmpty({ message: 'The location field is required.' })
  @ValidateNested({
    message: 'The location field must be a valid LocationDTO object.',
  })
  @Type(() => LocationDTO)
  location: LocationDTO;

  @IsOptional()
  @ValidateNested({
    message: 'The publisher field must be a valid PublisherDTO object.',
  })
  @Type(() => PublisherDTO)
  publisher?: PublisherDTO;

  @IsOptional()
  @IsNumber({}, { message: 'The bookId field must be a number.' })
  bookId?: number;
}
