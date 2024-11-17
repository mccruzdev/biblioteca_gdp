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
  ApiBody,
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
  @ApiOperation({ summary: 'Obtener todas las locaciones con paginación' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de la página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Resultados por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Locaciones devueltas correctamente',
  })
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
  @ApiOperation({ summary: 'Crear una nueva locación' })
  @ApiBody({
    type: LocationDTO,
    examples: {
      example: {
        value: {
          shelf: 'Estante Superior',
          shelfColor: 'Rojo',
          shelfLevel: 'N° 1',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Locación creada correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  createLocation(@Body() location: LocationDTO) {
    return this.locationService.createLocation(location);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar una locación por ID' })
  @ApiBody({
    type: LocationDTO,
    examples: {
      example: {
        value: {
          shelf: 'Estante Superior',
          shelfColor: 'Rojo',
          shelfLevel: 'N° 1',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Locación actualizada correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Locación no encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  updateLocation(@Param('id') id: string, @Body() location: LocationDTO) {
    return this.locationService.updateLocation(Number(id), location);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Eliminar una locación por ID' })
  @ApiResponse({ status: 204, description: 'Locación eliminada correctamente' })
  @ApiResponse({
    status: 404,
    description: 'Locación no encontrada',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  deleteLocation(@Param('id') id: string) {
    return this.locationService.deleteLocation(Number(id));
  }
}
