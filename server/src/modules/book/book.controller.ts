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
  @ApiOperation({ summary: 'Get a paginated list of all books' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number for pagination',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of results per page',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of books retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters provided',
  })
  getAllBooks(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.booksService.getAllBooks(Number(page), Number(limit));
  }

  @Get(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the book to get',
  })
  @ApiResponse({
    status: 200,
    description: 'Book retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided for retrieving the book',
  })
  getBookById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBookById(id);
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Create a new book entry' })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided for creating the book',
  })
  async createBook(@Body() book: BookDTO) {
    return this.booksService.createBook(book);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Update an existing book by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the book to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided for updating the book',
  })
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() book: BookDTO,
  ) {
    return this.booksService.updateBook(id, book);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the book to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Book deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found',
  })
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
