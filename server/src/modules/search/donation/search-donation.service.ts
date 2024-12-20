import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';

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

@Injectable()
export class SearchDonationService {
  constructor(private prisma: PrismaService) {}

  async getDonationByDescription(
    page: number,
    limit: number,
    description: string,
  ) {
    return paginateDonationByDescription(
      this.prisma.donation,
      {
        select: {
          id: true,
          date: true,
          description: true,
          Donor: true,
        },
        where: { description: { contains: description } },
      },
      { page, limit, path: `search/donation-by-description/${description}` },
    );
  }

  async getDonationByDonorName(page: number, limit: number, name: string) {
    return paginateDonationByDonorName(
      this.prisma.donation,
      {
        select: {
          id: true,
          date: true,
          description: true,
          Donor: true,
        },
        where: { Donor: { name: { contains: name } } },
      },
      { page, limit, path: `search/donation-by-donor/${name}` },
    );
  }

  async getDonationByCopyCode(page: number, limit: number, code: string) {
    return paginateDonationByCopyCode(
      this.prisma.donation,
      {
        select: {
          id: true,
          date: true,
          description: true,
          Donor: true,
        },
        where: { copies: { some: { code: { contains: code } } } },
      },
      { page, limit, path: `search/donation-by-copycode/${code}` },
    );
  }
}
