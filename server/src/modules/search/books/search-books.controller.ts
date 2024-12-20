import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchBooksService } from './search-books.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchBooksController {
  constructor(private readonly searchService: SearchBooksService) {}

  @Get('books-by-author/:author')
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener libros paginados por autor' })
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
  @ApiParam({
    name: 'author',
    type: String,
    description: 'Autor',
  })
  @ApiResponse({
    status: 200,
    description: 'Libros del autor',
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
  getBooksByAuthor(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('author') author: string,
  ) {
    return this.searchService.getBooksByAuthor(page, limit, author);
  }

  @Get('books-by-category/:category')
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener libros paginados por categoria' })
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
  @ApiParam({
    name: 'category',
    type: String,
    description: 'Categoría',
  })
  @ApiResponse({
    status: 200,
    description: 'Libros del autor',
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
  getBooksByCategory(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('category') category: string,
  ) {
    return this.searchService.getBooksByCategory(page, limit, category);
  }

  @Get('books-by-subcategory/:subcategory')
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener libros paginados por subcategoria' })
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
  @ApiParam({
    name: 'subcategory',
    type: String,
    description: 'Subcategoría',
  })
  @ApiResponse({
    status: 200,
    description: 'Libros del autor',
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
  getBooksBySubcategory(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('subcategory') subcategory: string,
  ) {
    return this.searchService.getBooksBySubcategory(page, limit, subcategory);
  }

  @Get('books-by-title/:title')
  @Roles('READER')
  @ApiOperation({ summary: 'Obtener libros paginados por titulo' })
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
  @ApiParam({
    name: 'title',
    type: String,
    description: 'Titulo',
  })
  @ApiResponse({
    status: 200,
    description: 'Libros del autor',
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
  getBooksByTitle(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('title') title: string,
  ) {
    return this.searchService.getBooksByTitle(page, limit, title);
  }
}
