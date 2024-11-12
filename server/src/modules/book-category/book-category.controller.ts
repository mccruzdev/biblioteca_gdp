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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of books per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched category books',
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
