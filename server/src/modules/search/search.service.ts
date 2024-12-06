import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';

const paginateAuthor: PaginateFunction = paginator({
  path: 'search/author',
  limit: 10,
});

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  customSelect = {
    id: true,
    title: true,
    pages: true,
    authors: true,
    Subcategory: {
      select: { name: true, Category: { select: { name: true } } },
    },
  };

  async getBooksByAuthor(page: number, limit: number, author: string) {
    return paginateAuthor(
      this.prisma.book,
      {
        select: this.customSelect,
        where: { authors: { some: { name: { contains: author } } } },
      },
      { page, limit, path: `search/author/${author}` },
    );
  }
}
