import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Get all books with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of books per page',
  })
  @ApiResponse({ status: 200, description: 'Successfully fetched books' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getAllBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.booksService.getAllBooks(Number(page), Number(limit));
  }
}
