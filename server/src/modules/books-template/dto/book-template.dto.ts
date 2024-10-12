import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  Length,
} from 'class-validator';

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
  categoryId?: number;
}
