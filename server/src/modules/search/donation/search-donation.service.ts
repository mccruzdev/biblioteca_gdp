import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { transformDonations } from 'src/transformers/donation';

const paginateDonationByDescription: PaginateFunction = paginator({
  path: 'search/donation-by-description',
  limit: 10,
});

const paginateDonationByDonorName: PaginateFunction = paginator({
  path: 'search/donation-by-donor',
  limit: 10,
});

const paginateDonationByCopyCode: PaginateFunction = paginator({
  path: 'search/donation-by-copycode',
  limit: 10,
});

const paginateDonationByBook: PaginateFunction = paginator({
  path: 'search/donation-by-book',
  limit: 10,
});

@Injectable()
export class SearchDonationService {
  constructor(private prisma: PrismaService) {}

  select = {
    id: true,
    date: true,
    description: true,
    Donor: true,
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
  };

  async getDonationByDescription(
    page: number,
    limit: number,
    description: string,
  ) {
    return paginateDonationByDescription(
      this.prisma.donation,
      {
        select: this.select,
        where: { description: { contains: description } },
      },
      { page, limit, path: `search/donation-by-description/${description}` },
      transformDonations,
    );
  }

  async getDonationByDonorName(page: number, limit: number, name: string) {
    return paginateDonationByDonorName(
      this.prisma.donation,
      {
        select: this.select,
        where: { Donor: { name: { contains: name } } },
      },
      { page, limit, path: `search/donation-by-donor/${name}` },
      transformDonations,
    );
  }

  async getDonationByCopyCode(page: number, limit: number, code: string) {
    return paginateDonationByCopyCode(
      this.prisma.donation,
      {
        select: this.select,
        where: { copies: { some: { code: { contains: code } } } },
      },
      { page, limit, path: `search/donation-by-copycode/${code}` },
      transformDonations,
    );
  }

  async getDonationByBook(page: number, limit: number, book: string) {
    return paginateDonationByBook(
      this.prisma.donation,
      {
        select: this.select,
        where: { copies: { some: { Book: { title: { contains: book } } } } },
      },
      { page, limit, path: `search/donation-by-book/${book}` },
      transformDonations,
    );
  }
}
