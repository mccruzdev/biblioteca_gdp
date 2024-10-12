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
    } catch {
      throw this.invalidDataException;
    }
  }

  async updateTemplateBook(id: number, book: BookTemplateDTO) {
    try {
      return await this.prisma.bookTemplate.update({
        where: { id },
        data: book,
      });
    } catch {
      throw this.invalidDataException;
    }
  }

  async deleteTemplateBook(id: number) {
    try {
      return await this.prisma.bookTemplate.deleteMany({ where: { id } });
    } catch {
      throw this.invalidDataException;
    }
  }
}
