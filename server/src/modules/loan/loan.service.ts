import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateLoanDTO } from './dto/create-loan.dto';
import { UpdateLoanDTO } from './dto/update-loan.dto';
import { transformLoans } from 'src/transformers/loan';

const paginateAll: PaginateFunction = paginator({
  path: 'loan',
  limit: 10,
});

const paginateMe: PaginateFunction = paginator({
  path: 'loan/me',
  limit: 10,
});

@Injectable()
export class LoanService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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

  async getAllLoans(page: number, limit: number) {
    return paginateAll(
      this.prisma.loan,
      { select: this.selectLoan },
      { page, limit, path: 'loan' },
      transformLoans,
    );
  }

  async getMyReservations(
    authorization: string | undefined,
    page: number,
    limit: number,
  ) {
    const data = this.tokenManager.getDataFromHeader(authorization);

    return paginateMe(
      this.prisma.loan,
      {
        select: this.selectLoan,
        where: { userId: data.id },
      },
      { page, limit, path: 'loan/me' },
      transformLoans,
    );
  }

  async registerLoan(authorization: string | undefined, data: CreateLoanDTO) {
    const dataHeader = this.tokenManager.getDataFromHeader(authorization);

    await this.prisma.loan.create({
      data: {
        dueDate: data.dueDate,
        status: 'ACTIVE',
        userId: dataHeader.id,
        copies: {
          connect: data.copies.map((copyId) => ({ id: copyId })),
        },
      },
    });
  }

  async updateLoan(id: number, data: UpdateLoanDTO) {
    try {
      await this.prisma.loan.update({
        data: {
          dueDate: data.dueDate,
          status: data.status,
          copies: {
            set: data.copies.map((copyId) => ({ id: copyId })),
          },
        },
        where: { id },
      });
    } catch {
      throw new HttpException(
        'Loan or Copy Id not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteLoan(id: number) {
    try {
      await this.prisma.loan.delete({
        where: { id },
      });
    } catch {
      throw new HttpException('Loan not found', HttpStatus.NOT_FOUND);
    }
  }
}
