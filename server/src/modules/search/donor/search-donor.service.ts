import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';

const paginateDonorByName: PaginateFunction = paginator({
  path: 'search/donor-by-name',
  limit: 10,
});

const paginateDonorByEmail: PaginateFunction = paginator({
  path: 'search/donor-by-email',
  limit: 10,
});

@Injectable()
export class SearchDonorService {
  constructor(private prisma: PrismaService) {}

  async getDonorsByName(page: number, limit: number, name: string) {
    return paginateDonorByName(
      this.prisma.donor,
      {
        where: { name: { contains: name } },
      },
      { page, limit, path: `search/donor-by-name/${name}` },
    );
  }

  async getDonorsByEmail(page: number, limit: number, email: string) {
    return paginateDonorByEmail(
      this.prisma.donor,
      {
        where: { email: { contains: email } },
      },
      { page, limit, path: `search/donor-by-email/${email}` },
    );
  }
}
