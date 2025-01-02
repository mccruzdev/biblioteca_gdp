import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
import { transformReservations } from 'src/transformers/reservation';
import { ReservationToLoanDTO } from './dto/reservation-to-loan.dto';

const paginateAll: PaginateFunction = paginator({
  path: 'reservation',
  limit: 10,
});

const paginateMe: PaginateFunction = paginator({
  path: 'reservation/me',
  limit: 10,
});

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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

  async getAllReservations(page: number, limit: number) {
    return paginateAll(
      this.prisma.reservation,
      { select: this.selectReservation },
      { page, limit, path: 'reservation' },
      transformReservations,
    );
  }

  async getMyReservations(
    authorization: string | undefined,
    page: number,
    limit: number,
  ) {
    const data = this.tokenManager.getDataFromHeader(authorization);

    return paginateMe(
      this.prisma.reservation,
      {
        select: this.selectReservation,
        where: { userId: data.id },
      },
      { page, limit, path: 'reservation/me' },
      transformReservations,
    );
  }

  async registerReservation(
    authorization: string | undefined,
    data: CreateReservationDTO,
  ) {
    const dataHeader = this.tokenManager.getDataFromHeader(authorization);

    await this.prisma.reservation.create({
      data: {
        dueDate: data.dueDate,
        status: 'PENDING',
        userId: dataHeader.id,
        copies: {
          connect: data.copies.map((copyId) => ({ id: copyId })),
        },
      },
    });
  }

  async reservationToLoan(data: ReservationToLoanDTO) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: data.reservationId },
    });

    await this.prisma.reservation.update({
      data: { status: 'PICKED_UP' },
      where: { id: data.reservationId },
    });

    await this.prisma.loan.create({
      data: {
        dueDate: data.dueDate,
        status: 'ACTIVE',
        copies: {
          connect: data.copies.map((copyId) => ({ id: copyId })),
        },
        userId: reservation.userId,
      },
    });
  }

  async updateReservation(id: number, data: UpdateReservationDTO) {
    try {
      await this.prisma.reservation.update({
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
        'Reservation or Copy Id not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteReservation(authorization: string | undefined, id: number) {
    const dataHeader = this.tokenManager.getDataFromHeader(authorization);

    try {
      await this.prisma.reservation.delete({
        where: { id, userId: dataHeader.id },
      });
    } catch {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }
  }
}
