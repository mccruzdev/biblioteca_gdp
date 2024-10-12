import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsPositive,
  Length,
} from 'class-validator';
import { BookStatusE } from 'src/types';

export class BookTemplateDTO {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  author?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  publisher?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  pages?: number;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  code?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @IsEnum(BookStatusE)
  status: BookStatusE;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsInt()
  conditionId?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}
