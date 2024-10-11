import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  backendURL = this.configService.get<string>('BACKEND_SERVER');

  async getAllBooks(page: number, limit: number) {
    const url = `${this.backendURL}/books`;

    const [count, books] = await Promise.all([
      this.prisma.book.count(),
      this.prisma.book.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      count,
      data: books,
      prev: page > 1 ? `${url}?page=${page - 1}&limit=${limit}` : null,
      next:
        page < Math.ceil(count / limit)
          ? `${url}?page=${page + 1}&limit=${limit}`
          : null,
    };
  }
}
