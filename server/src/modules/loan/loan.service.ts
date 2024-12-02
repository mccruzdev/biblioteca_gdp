import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateLoanDTO } from './dto/create-loan.dto';
import { UpdateLoanDTO } from './dto/update-loan.dto';

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
      },
    },
  };

  async getAllLoans(page: number, limit: number) {
    return paginateAll(
      this.prisma.loan,
      { select: this.selectLoan },
      { page, limit, path: 'loan' },
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

  async updateLoan(
    authorization: string | undefined,
    id: number,
    data: UpdateLoanDTO,
  ) {
    const dataHeader = this.tokenManager.getDataFromHeader(authorization);

    try {
      await this.prisma.loan.update({
        data: {
          dueDate: data.dueDate,
          status: data.status,
          copies: {
            set: data.copies.map((copyId) => ({ id: copyId })),
          },
        },
        where: { id, userId: dataHeader.id },
      });
    } catch {
      throw new HttpException(
        'Loan or Copy Id not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteLoan(authorization: string | undefined, id: number) {
    const dataHeader = this.tokenManager.getDataFromHeader(authorization);

    try {
      await this.prisma.loan.delete({
        where: { id, userId: dataHeader.id },
      });
    } catch {
      throw new HttpException('Loan not found', HttpStatus.NOT_FOUND);
    }
  }
}
