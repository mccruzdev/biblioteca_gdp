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
  ApiParam,
} from '@nestjs/swagger';
import { BooksTemplateService } from './books-template.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { BookTemplateDTO } from './dto/book-template.dto';

@ApiTags('Books')
@ApiBearerAuth()
@Controller('books-template')
export class BooksTemplateController {
  constructor(private readonly booksService: BooksTemplateService) {}

  @Get()
  @Roles('READER')
  @ApiOperation({ summary: 'Get all books with pagination' })
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
  @ApiResponse({ status: 200, description: 'Successfully fetched books' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Insufficient permissions',
  })
  getAllBooks(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.booksService.getAllBooks(Number(page), Number(limit));
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Create a new book template' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created the book template',
    type: BookTemplateDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid data provided',
  })
  async createTemplateBook(@Body() book: BookTemplateDTO) {
    return this.booksService.createTemplateBook(book);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Update a book template by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the book template to update',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the book template',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Book template does not exist',
  })
  async updateTemplateBook(
    @Param('id') id: number,
    @Body() book: BookTemplateDTO,
  ) {
    return this.booksService.updateTemplateBook(Number(id), book);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Delete a book template by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the book template to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the book template',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Book template does not exist',
  })
  async deleteTemplateBook(@Param('id') id: number) {
    return this.booksService.deleteTemplateBook(Number(id));
  }
}
