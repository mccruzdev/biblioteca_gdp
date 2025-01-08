import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { transformReservations } from 'src/transformers/reservation';
import { ReservationStatus } from 'src/types';

const paginatedMyReservationsByStatus: PaginateFunction = paginator({
  path: 'search/reservation-me-by-status',
  limit: 10,
});

const paginatedAllReservationsByStatus: PaginateFunction = paginator({
  path: 'search/reservation-by-status',
  limit: 10,
});

@Injectable()
export class SearchReservationService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  tokenManager = new TokenManager(this.jwtService);
  selectReservation = {
    id: true,
    created: true,
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

  async getMyReservationsByStatus(
    req: Request,
    page: number,
    limit: number,
    status: ReservationStatus,
  ) {
    const data = this.tokenManager.getDataFromHeader(req.headers.authorization);

    return paginatedMyReservationsByStatus(
      this.prisma.reservation,
      {
        select: this.selectReservation,
        where: { userId: data.id, status },
        orderBy: [{ created: 'desc' }],
      },
      { page, limit, path: `search/reservation-me-by-status/${status}` },
      transformReservations,
    );
  }

  async getAllReservationsByStatus(
    page: number,
    limit: number,
    status: ReservationStatus,
  ) {
    return paginatedAllReservationsByStatus(
      this.prisma.reservation,
      {
        select: this.selectReservation,
        where: { status },
        orderBy: [{ created: 'desc' }],
      },
      { page, limit, path: `search/reservation-by-status/${status}` },
      transformReservations,
    );
  }
}
