import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoanStatus } from '@prisma/client';
import { Request } from 'express';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { transformLoans } from 'src/transformers/loan';

const paginatedMyLoansByStatus: PaginateFunction = paginator({
  path: 'search/loan-me-by-status',
  limit: 10,
});

const paginatedAllLoansByStatus: PaginateFunction = paginator({
  path: 'search/loan-by-status',
  limit: 10,
});

@Injectable()
export class SearchLoanService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  tokenManager = new TokenManager(this.jwtService);
  selectLoan = {
    id: true,
    loanDate: true,
    dueDate: true,
    status: true,
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
          },
        },
      },
    },
  };

  async getMyLoansByStatus(
    req: Request,
    page: number,
    limit: number,
    status: LoanStatus,
  ) {
    const data = this.tokenManager.getDataFromHeader(req.headers.authorization);

    return paginatedMyLoansByStatus(
      this.prisma.loan,
      {
        select: this.selectLoan,
        where: { userId: data.id, status },
        orderBy: [{ loanDate: 'desc' }],
      },
      { page, limit, path: `search/loan-me-by-status/${status}` },
      transformLoans,
    );
  }

  async getAllLoansByStatus(page: number, limit: number, status: LoanStatus) {
    return paginatedAllLoansByStatus(
      this.prisma.loan,
      {
        select: this.selectLoan,
        where: { status },
        orderBy: [{ loanDate: 'desc' }],
      },
      { page, limit, path: `search/loan-by-status/${status}` },
      transformLoans,
    );
  }
}
