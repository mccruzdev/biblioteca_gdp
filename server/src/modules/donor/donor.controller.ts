import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { DonorService } from './donor.service';
import { DonorDto } from './dto/donor.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Donor')
@ApiBearerAuth()
@Controller('donor')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Get()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener una lista paginada de los donantes' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de todos los autores',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getAllDonors(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.donorService.getAllDonors(Number(page), Number(limit));
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Crear un nuevo donante' })
  @ApiBody({
    type: DonorDto,
    examples: {
      example: {
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Autor creado correctamente',
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
  createDonor(@Body() data: DonorDto) {
    return this.donorService.createDonor(data);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar donante' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del donante a actualizar',
  })
  @ApiBody({
    type: DonorDto,
    examples: {
      example: {
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Donante actualizado correctamente',
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
  @ApiResponse({
    status: 404,
    description: 'ID del donante no encontrado',
  })
  updateDonor(@Param('id', ParseIntPipe) id: number, @Body() data: DonorDto) {
    return this.donorService.updateDonor(id, data);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Eliminar donante' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del donante a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Donante eliminado correctamente',
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
  @ApiResponse({
    status: 404,
    description: 'ID del donante no encontrado',
  })
  deleteDonor(@Param('id', ParseIntPipe) id: number) {
    return this.donorService.deleteDonor(id);
  }
}
