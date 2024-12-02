import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  Length,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AuthorDTO } from 'src/modules/author/dto/author.dto';

export class BookDTO {
  @IsString()
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pages?: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AuthorDTO)
  authors?: AuthorDTO[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subcategory?: string;
}
