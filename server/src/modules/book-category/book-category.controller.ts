import { Controller, Get, Query } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('CategoryBooks')
@ApiBearerAuth()
@Controller('book-category')
export class BookCategoryController {
  constructor(private readonly bookCategoryService: BookCategoryService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Get all categories of books with pagination' })
  @ApiOperation({ summary: 'Retorna todas las categorias con paginación' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Resultado por páginas',
  })
  @ApiResponse({
    status: 200,
    description: 'Categorias devueltas correctamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Insufficient permissions',
  })
  getAllCategories(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.bookCategoryService.getAllCategories(
      Number(page),
      Number(limit),
    );
  }
}
