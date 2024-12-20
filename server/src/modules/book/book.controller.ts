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
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BooksService } from './book.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { BookDTO } from './dto/book.dto';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('book')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener una lista paginada de todos los libros' })
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
    description: 'Lista paginada de todos los libros',
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
  getAllBooks(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.booksService.getAllBooks(Number(page), Number(limit));
  }

  @Get(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener un libro por su ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del libro a obtener',
  })
  @ApiResponse({
    status: 200,
    description: 'Libro devuelto satisfactoriamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Libro no encontrado',
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
  getBookById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBookById(id);
  }

  // getBooksByAuthor(@Param('author') author: string) {}

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Agregar un nuevo libro' })
  @ApiBody({
    type: BookDTO,
    examples: {
      example: {
        value: {
          title: 'Introduction to NestJS',
          pages: 300,
          authors: [
            {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
            {
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
            },
          ],
          category: 'Programming',
          subcategory: 'Backend Development',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Libro creado correctamente',
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
  createBook(@Body() book: BookDTO) {
    return this.booksService.createBook(book);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar un libro por ID' })
  @ApiBody({
    type: BookDTO,
    examples: {
      example: {
        value: {
          title: 'Introduction to NestJS',
          pages: 300,
          authors: [
            {
              name: 'John Doe',
              email: 'john.doe@example.com',
            },
            {
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
            },
          ],
          category: 'Programming',
          subcategory: 'Backend Development',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del libro a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Libro actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Libro no encontrado',
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
  updateBook(@Param('id', ParseIntPipe) id: number, @Body() book: BookDTO) {
    return this.booksService.updateBook(id, book);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Eliminar un libro por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del libro a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Libro eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Libro no encontrado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
