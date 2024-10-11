import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('all')
  @Roles('READER')
  getAllBooks() {
    return [
      {
        id: 1,
        title: 'Book 1',
        author: 'Author 1',
      },
      {
        id: 2,
        title: 'Book 2',
        author: 'Author 2',
      },
    ];
  }
}
