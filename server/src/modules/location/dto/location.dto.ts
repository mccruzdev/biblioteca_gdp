import { IsString, IsOptional, Length } from 'class-validator';

export class LocationDTO {
  @IsString({ message: 'The shelf field must be a string.' })
  @Length(1, 255, {
    message: 'The shelf field must be between 1 and 255 characters long.',
  })
  shelf: string;

  @IsOptional()
  @IsString({ message: 'The shelfColor field must be a string.' })
  @Length(1, 50, {
    message: 'The shelfColor field must be at most 50 characters long.',
  })
  shelfColor?: string;

  @IsOptional()
  @IsString({ message: 'The shelfLevel field must be an integer.' })
  @Length(1, 50, {
    message: 'The shelfColor field must be at most 50 characters long.',
  })
  shelfLevel?: string;
}
