import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { BookDTO } from './dto/book.dto';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { Author } from 'src/types';
import {
  transformBook,
  transformBooks,
  transformBooksWithCopies,
} from 'src/transformers/book';

const paginate: PaginateFunction = paginator({
  path: 'book',
  limit: 10,
});

const paginateCatalog: PaginateFunction = paginator({
  path: 'book/catalog',
  limit: 10,
});

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  invalidDataException = new HttpException(
    'Error creating the book, please verify the provided data.',
    HttpStatus.BAD_REQUEST,
  );

  customSelect = {
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
  };

  async getCatalogBooks(page: number, limit: number) {
    const currentDate = new Date();
    return paginateCatalog(
      this.prisma.book,
      {
        select: this.customSelect,
        where: {
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
              ],
            },
          },
        },
      },
      { page, limit, path: 'book/catalog' },
      transformBooks,
    );
  }

  async getAllBooks(page: number, limit: number) {
    return await paginate(
      this.prisma.book,
      {
        select: {
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
          },
        },
      },
      { page, path: 'book', limit },
      transformBooksWithCopies,
    );
  }

  async getBookById(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select: this.customSelect,
    });

    if (!book) throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    return transformBook(book);
  }

  async createBook(book: BookDTO) {
    try {
      const data = {
        title: book.title,
        pages: book.pages,
        categoryId: null,
        subcategoryId: null,
        authors: [] as Author[],
      };

      const { categoryId, subcategoryId } =
        await this._createOrUpdateCategoryAndSubcategory(book);
      data.categoryId = categoryId;
      data.subcategoryId = subcategoryId;

      data.authors = await this._createOrUpdateAuthors(book);

      await this.prisma.book.create({
        data: {
          title: data.title,
          pages: data.pages,
          subcategoryId: data.subcategoryId,
          authors: {
            connectOrCreate: data.authors.map((author) => {
              return {
                where: { id: author.id },
                create: { name: author.name, email: author.email },
              };
            }),
          },
        },
      });
    } catch (error) {
      throw this.invalidDataException;
    }
  }

  async updateBook(id: number, book: BookDTO) {
    try {
      const data: {
        title: string;
        pages: number;
        categoryId: null | number;
        subcategoryId: null | number;
        authors: Author[];
      } = {
        title: book.title,
        pages: book.pages,
        categoryId: null,
        subcategoryId: null,
        authors: [],
      };

      const { categoryId, subcategoryId } =
        await this._createOrUpdateCategoryAndSubcategory(book);
      data.categoryId = categoryId;
      data.subcategoryId = subcategoryId;

      data.authors = await this._createOrUpdateAuthors(book);

      await this.prisma.book.update({
        where: { id },
        data: {
          title: data.title,
          pages: data.pages,
          subcategoryId: data.subcategoryId,
          authors: {
            set: data.authors.map((author) => ({
              id: author.id,
            })),
          },
        },
      });
    } catch (error) {
      throw this.invalidDataException;
    }
  }

  async deleteBook(id: number) {
    try {
      await this.prisma.book.delete({ where: { id } });
      return { message: 'Book successfully deleted' };
    } catch (error) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
  }

  // Create category and subcategory if not exist and is provided
  async _createOrUpdateCategoryAndSubcategory(book: BookDTO): Promise<{
    categoryId: null | number;
    subcategoryId: null | number;
  }> {
    let data = {
      categoryId: null,
      subcategoryId: null,
    };

    if (book.category) {
      const category = await this.prisma.category.upsert({
        where: { name: book.category },
        update: {},
        create: { name: book.category },
      });
      data.categoryId = category.id;

      if (book.subcategory) {
        const subcategory = await this.prisma.subcategory.upsert({
          where: { name: book.subcategory, categoryId: data.categoryId },
          update: {},
          create: { name: book.subcategory, categoryId: category.id },
        });
        data.subcategoryId = subcategory.id;
      }
    }

    return data;
  }

  // Actualizar o crear autores si se proporciona
  async _createOrUpdateAuthors(book: BookDTO) {
    let authors: Author[] = [];

    if (book.authors) {
      const authorNames = book.authors.map((author) => author.name);
      const existingAuthors = await this.prisma.author.findMany({
        where: { name: { in: authorNames } },
      });
      const existingAuthorNames = existingAuthors.map((author) => author.name);

      const newAuthorsData = book.authors
        .filter((author) => !existingAuthorNames.includes(author.name))
        .map((author) => ({
          name: author.name,
          email: author.email ?? null,
        }));

      if (newAuthorsData.length > 0) {
        await this.prisma.author.createMany({ data: newAuthorsData });
        const newAuthors = await this.prisma.author.findMany({
          where: { name: { in: newAuthorsData.map((a) => a.name) } },
        });
        authors.push(...newAuthors);
      }
      authors.push(...existingAuthors);
    }

    return authors;
  }
}
