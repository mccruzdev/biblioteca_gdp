import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';
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
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('author/:author')
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
  getBooksByAuthor(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('author') author: string,
  ) {
    return this.searchService.getBooksByAuthor(page, limit, author);
  }
}
