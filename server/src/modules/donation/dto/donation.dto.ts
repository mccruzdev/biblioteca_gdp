import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CopyDto } from 'src/modules/copy/dto/create-copy.dto';

export class DonationDTO {
  @IsInt()
  donorId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CopyDto)
  copies: CopyDto[];
}
