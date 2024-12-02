import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';

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
      },
    },
  };

  async getAllReservations(page: number, limit: number) {
    return paginateAll(
      this.prisma.reservation,
      { select: this.selectReservation },
      { page, limit, path: 'reservation' },
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
      { page, limit, path: 'reservation' },
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

  async updateReservation(
    authorization: string | undefined,
    id: number,
    data: UpdateReservationDTO,
  ) {
    const dataHeader = this.tokenManager.getDataFromHeader(authorization);

    try {
      await this.prisma.reservation.update({
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
