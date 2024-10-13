import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { LocationService } from './location.service';
import { LocationDTO } from './dto/location.dto';

@ApiTags('Location')
@ApiBearerAuth()
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Get all locations with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of locations per page',
  })
  @ApiResponse({ status: 200, description: 'Successfully fetched locations' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getAllLocation(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.locationService.getAllLocation(Number(page), Number(limit));
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Successfully created location' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid data provided',
  })
  createLocation(@Body() location: LocationDTO) {
    return this.locationService.createLocation(location);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiResponse({ status: 200, description: 'Successfully updated location' })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Location not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid data provided',
  })
  updateLocation(@Param('id') id: string, @Body() location: LocationDTO) {
    return this.locationService.updateLocation(Number(id), location);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiResponse({ status: 204, description: 'Successfully deleted location' })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Location not found',
  })
  deleteLocation(@Param('id') id: string) {
    return this.locationService.deleteLocation(Number(id));
  }
}
