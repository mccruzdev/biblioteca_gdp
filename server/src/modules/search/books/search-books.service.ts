import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import {
  transformBooks,
  transformBooksWithCopies,
} from 'src/transformers/book';

const paginateCatalogAuthor: PaginateFunction = paginator({
  path: 'search/books-catalog-by-author',
  limit: 10,
});

const paginateCatalogCategory: PaginateFunction = paginator({
  path: 'search/books-catalog-by-category',
  limit: 10,
});

const paginateCatalogSubcategory: PaginateFunction = paginator({
  path: 'search/books-catalog-by-subcategory',
  limit: 10,
});

const paginateCatalogTitle: PaginateFunction = paginator({
  path: 'search/books-catalog-by-title',
  limit: 10,
});

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

  getWhere(more: object) {
    const currentDate = new Date();

    return {
      copies: {
        some: {
          OR: [
            {
              loans: {
                none: {
                  AND: [
                    { loanDate: { lte: currentDate } },
                    { dueDate: { gte: currentDate } },
                    { status: { not: 'RETURNED' } },
                  ],
                },
              },
            },
            {
              loans: {
                none: {},
              },
            },
            {
              isDeleted: { equals: true },
            },
          ],
        },
      },
      ...more,
    };
  }

  async getCatalogBooksByAuthor(page: number, limit: number, author: string) {
    return paginateCatalogAuthor(
      this.prisma.book,
      {
        select: this.customSelect,
        where: this.getWhere({
          authors: { some: { name: { contains: author } } },
        }),
      },
      { page, limit, path: `search/books-catalog-by-author/${author}` },
      transformBooks,
    );
  }

  async getCatalogBooksByCategory(
    page: number,
    limit: number,
    category: string,
  ) {
    return paginateCatalogCategory(
      this.prisma.book,
      {
        select: this.customSelect,
        where: this.getWhere({
          Subcategory: {
            Category: {
              name: { contains: category },
            },
          },
        }),
      },
      { page, limit, path: `search/books-catalog-by-category/${category}` },
      transformBooks,
    );
  }

  async getCatalogBooksBySubcategory(
    page: number,
    limit: number,
    subcategory: string,
  ) {
    return paginateCatalogSubcategory(
      this.prisma.book,
      {
        select: this.customSelect,
        where: this.getWhere({
          Subcategory: {
            name: { contains: subcategory },
          },
        }),
      },
      {
        page,
        limit,
        path: `search/books-catalog-by-subcategory/${subcategory}`,
      },
      transformBooks,
    );
  }

  async getCatalogBooksByTitle(page: number, limit: number, title: string) {
    return paginateCatalogTitle(
      this.prisma.book,
      {
        select: this.customSelect,
        where: this.getWhere({ title: { contains: title } }),
      },
      { page, limit, path: `search/books-catalog-by-title/${title}` },
      transformBooks,
    );
  }

  selectBooks = {
    id: true,
    title: true,
    pages: true,
    authors: true,
    Subcategory: {
      select: {
        name: true,
        Category: {
          select: {
            name: true,
          },
        },
      },
    },
    copies: {
      select: {
        id: true,
        code: true,
        condition: true,
        Location: true,
        Publisher: true,
        Book: {
          select: {
            id: true,
            title: true,
            pages: true,
            authors: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            Subcategory: {
              select: {
                name: true,
                Category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        isDeleted: { equals: false },
      },
    },
  };

  async getBooksByAuthor(page: number, limit: number, author: string) {
    return paginateAuthor(
      this.prisma.book,
      {
        select: this.selectBooks,
        where: { authors: { some: { name: { contains: author } } } },
      },
      { page, limit, path: `search/books-by-author/${author}` },
      transformBooksWithCopies,
    );
  }

  async getBooksByCategory(page: number, limit: number, category: string) {
    return paginateCategory(
      this.prisma.book,
      {
        select: this.selectBooks,
        where: {
          Subcategory: {
            Category: {
              name: { contains: category },
            },
          },
        },
      },
      { page, limit, path: `search/books-by-category/${category}` },
      transformBooksWithCopies,
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
        select: this.selectBooks,
        where: {
          Subcategory: {
            name: { contains: subcategory },
          },
        },
      },
      { page, limit, path: `search/books-by-subcategory/${subcategory}` },
      transformBooksWithCopies,
    );
  }

  async getBooksByTitle(page: number, limit: number, title: string) {
    return paginateTitle(
      this.prisma.book,
      {
        select: this.selectBooks,
        where: { title: { contains: title } },
      },
      { page, limit, path: `search/books-by-title/${title}` },
      transformBooksWithCopies,
    );
  }
}
