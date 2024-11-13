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

class Author {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(5, 100)
  email?: string;
}

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
  @Type(() => Author)
  authors: Author[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subcategory?: string;
}
