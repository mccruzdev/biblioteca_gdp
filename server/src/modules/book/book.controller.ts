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
  getAllBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
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
  getBookById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBookById(id);
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Agregar un nuevo libro' })
  @ApiResponse({
    status: 201,
    description: 'Libro creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  createBook(@Body() book: BookDTO) {
    return this.booksService.createBook(book);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar un libro por ID' })
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
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
