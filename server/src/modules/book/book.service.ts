import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { BookDTO } from './dto/book.dto';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';

const paginate: PaginateFunction = paginator({
  path: 'book',
  limit: 10,
});

@Injectable()
export class BooksTemplateService {
  constructor(private prisma: PrismaService) {}

  invalidDataException = new HttpException(
    'Error creating the book, please verify the provided data.',
    HttpStatus.BAD_REQUEST,
  );

  async getAllBooks(page: number, limit: number) {
    return paginate(this.prisma.book, {}, { page, limit, path: 'book' });
  }

  async createTemplateBook(book: BookDTO) {
    // try {
    //   return await this.prisma.book.create({ data: book });
    // } catch (error) {
    //   throw this.invalidDataException;
    // }
  }

  async updateTemplateBook(id: number, book: BookDTO) {
    // try {
    //   const updatedBook = await this.prisma.book.update({
    //     where: { id },
    //     data: book,
    //   });
    //   if (!updatedBook)
    //     throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    //   return updatedBook;
    // } catch (error) {
    //   throw this.invalidDataException;
    // }
  }

  async deleteTemplateBook(id: number) {
    // try {
    //   const result = await this.prisma.book.deleteMany({
    //     where: { id },
    //   });
    //   if (result.count === 0)
    //     throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    //   return { message: 'Book successfully deleted' };
    // } catch (error) {
    //   throw this.invalidDataException;
    // }
  }
}
