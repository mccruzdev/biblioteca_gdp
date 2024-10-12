import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { BookTemplateDTO } from './dto/book-template.dto';

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

  @Post()
  @Roles('LIBRARIAN')
  async createTemplateBook(@Body() book: BookTemplateDTO) {
    return this.booksService.createTemplateBook(book);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  async updateTemplateBook(
    @Param('id') id: number,
    @Body() book: BookTemplateDTO,
  ) {
    return this.booksService.updateTemplateBook(Number(id), book);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteTemplateBook(@Param('id') id: number) {
    return this.booksService.deleteTemplateBook(Number(id));
  }
}
