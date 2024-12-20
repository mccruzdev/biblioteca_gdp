import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { transformBooks } from 'src/transformers/book';

const paginateAuthor: PaginateFunction = paginator({
  path: 'search/books-by-author',
  limit: 10,
});

const paginateCategory: PaginateFunction = paginator({
  path: 'search/books-by-category',
  limit: 10,
});

const paginateSubcategory: PaginateFunction = paginator({
  path: 'search/books-by-subcategory',
  limit: 10,
});

const paginateTitle: PaginateFunction = paginator({
  path: 'search/books-by-title',
  limit: 10,
});

@Injectable()
export class SearchBooksService {
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
      { page, limit, path: `search/books-by-author/${author}` },
      transformBooks,
    );
  }

  async getBooksByCategory(page: number, limit: number, category: string) {
    return paginateCategory(
      this.prisma.book,
      {
        select: this.customSelect,
        where: {
          Subcategory: {
            Category: {
              name: { contains: category },
            },
          },
        },
      },
      { page, limit, path: `search/books-by-category/${category}` },
      transformBooks,
    );
  }

  async getBooksBySubcategory(
    page: number,
    limit: number,
    subcategory: string,
  ) {
    return paginateSubcategory(
      this.prisma.book,
      {
        select: this.customSelect,
        where: {
          Subcategory: {
            name: { contains: subcategory },
          },
        },
      },
      { page, limit, path: `search/books-by-subcategory/${subcategory}` },
      transformBooks,
    );
  }

  async getBooksByTitle(page: number, limit: number, title: string) {
    return paginateTitle(
      this.prisma.book,
      {
        select: this.customSelect,
        where: { title: { contains: title } },
      },
      { page, limit, path: `search/books-by-title/${title}` },
      transformBooks,
    );
  }
}
