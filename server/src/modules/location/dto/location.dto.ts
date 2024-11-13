import { IsString, IsOptional, IsInt, Length, Min } from 'class-validator';

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
  @IsInt({ message: 'The shelfLevel field must be an integer.' })
  @Min(0, { message: 'The shelfLevel field cannot be negative.' })
  shelfLevel?: string;
}
