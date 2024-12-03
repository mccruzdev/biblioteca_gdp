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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { AuthorDTO } from './dto/author.dto';

@ApiTags('Author')
@ApiBearerAuth()
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener una lista paginada de autores' })
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
  getAllAuthors(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.authorService.getAllAuthors(Number(page), Number(limit));
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Crear un nuevo autor' })
  @ApiBody({
    type: AuthorDTO,
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
  createAuthor(@Body() data: AuthorDTO) {
    return this.authorService.createAuthor(data);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar autor' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del autor a actualizar',
  })
  @ApiBody({
    type: AuthorDTO,
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
    description: 'Autor actualizado correctamente',
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
    description: 'ID del autor no encontrado',
  })
  updateAuthor(@Param('id', ParseIntPipe) id: number, @Body() data: AuthorDTO) {
    return this.authorService.updateAuthor(id, data);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Eliminar autor' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del autor a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Autor eliminado correctamente',
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
    description: 'ID del autor no encontrado',
  })
  deleteAuthor(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.deleteAuthor(id);
  }
}
