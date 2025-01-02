import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDTO } from 'src/modules/location/dto/location.dto';
import { BookConditionE } from 'src/types';
import { PublisherDTO } from 'src/modules/publisher/dto/publisher.dto';

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
  bookId: number;
}
