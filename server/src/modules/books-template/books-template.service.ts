import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { BookTemplateDTO } from './dto/book-template.dto';

@Injectable()
export class BooksTemplateService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  backendURL = this.configService.get<string>('BACKEND_SERVER');

  invalidDataException = new HttpException(
    'Error creating the book, please verify the provided data.',
    HttpStatus.BAD_REQUEST,
  );

  async getAllBooks(page: number, limit: number) {
    const url = `${this.backendURL}/books`;

    const [count, booksTemplate] = await Promise.all([
      this.prisma.bookTemplate.count(),
      this.prisma.bookTemplate.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      count,
      data: booksTemplate,
      prev: page > 1 ? `${url}?page=${page - 1}&limit=${limit}` : null,
      next:
        page < Math.ceil(count / limit)
          ? `${url}?page=${page + 1}&limit=${limit}`
          : null,
    };
  }

  async createTemplateBook(book: BookTemplateDTO) {
    try {
      return await this.prisma.bookTemplate.create({ data: book });
    } catch (error) {
      throw this.invalidDataException;
    }
  }

  async updateTemplateBook(id: number, book: BookTemplateDTO) {
    try {
      const updatedBook = await this.prisma.bookTemplate.update({
        where: { id },
        data: book,
      });

      if (!updatedBook)
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

      return updatedBook;
    } catch (error) {
      throw this.invalidDataException;
    }
  }

  async deleteTemplateBook(id: number) {
    try {
      const result = await this.prisma.bookTemplate.deleteMany({
        where: { id },
      });

      if (result.count === 0)
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

      return { message: 'Book successfully deleted' };
    } catch (error) {
      throw this.invalidDataException;
    }
  }
}
