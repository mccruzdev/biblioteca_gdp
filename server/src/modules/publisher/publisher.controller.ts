import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublisherDTO } from './dto/publisher.dto';

@ApiTags('Publisher')
@ApiBearerAuth()
@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener una lista paginada de las editoriales' })
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
    description: 'Lista paginada de todas las editoriales',
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
  getAllPublishers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.publisherService.getAllPublishers(Number(page), Number(limit));
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Crear una nueva editorial' })
  @ApiBody({
    type: PublisherDTO,
    examples: {
      example: {
        value: {
          name: 'Editorial Example',
          email: 'contact@example.com',
          country: 'USA',
          address: '123 Main St, Springfield, IL',
          phoneNumber: '+1234567890',
          website: 'https://example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Editorial creada correctamente',
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
  createPublisher(@Body() data: PublisherDTO) {
    return this.publisherService.createPublisher(data);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar editorial' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la editorial a actualizar',
  })
  @ApiBody({
    type: PublisherDTO,
    examples: {
      example: {
        value: {
          name: 'Editorial Example',
          email: 'contact@example.com',
          country: 'USA',
          address: '123 Main St, Springfield, IL',
          phoneNumber: '+1234567890',
          website: 'https://example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Editorial actualizado correctamente',
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
    description: 'ID de la editorial no encontrado',
  })
  updatePublisher(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PublisherDTO,
  ) {
    return this.publisherService.updatePublisher(id, data);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Eliminar editorial' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la editorial a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Editorial eliminada correctamente',
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
    description: 'ID de la editorial no encontrado',
  })
  deletePublisher(@Param('id', ParseIntPipe) id: number) {
    return this.publisherService.deletePublisher(id);
  }
}
