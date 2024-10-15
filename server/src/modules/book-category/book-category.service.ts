import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';

const paginate: PaginateFunction = paginator({
  path: 'book-category',
  limit: 10,
});

@Injectable()
export class BookCategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllBooks(page: number, limit: number) {
    return paginate(this.prisma.bookTemplate, {}, { page, limit });
  }
}
