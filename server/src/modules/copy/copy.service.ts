import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CopyDto } from './dto/create-copy.dto';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';

const paginate: PaginateFunction = paginator({
  path: 'copy',
  limit: 10,
});

@Injectable()
export class CopyService {
  constructor(private prisma: PrismaService) {}

  async getAllCopiesOfBook(page: number, limit: number, id: number) {
    const existingBook = await this.prisma.book.findUnique({ where: { id } });

    if (!existingBook)
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);

    return paginate(
      this.prisma.copy,
      {
        select: {
          id: true,
          code: true,
          condition: true,
          bookId: true,
          Location: {
            select: {
              id: true,
              shelf: true,
              shelfColor: true,
              shelfLevel: true,
            },
          },
          Publisher: {
            select: {
              id: true,
              name: true,
              email: true,
              country: true,
              address: true,
              phoneNumber: true,
              website: true,
            },
          },
        },
        where: { Book: { id }, isDeleted: { equals: false } },
      },
      { page, limit, path: 'copy' },
    );
  }

  async createCopy(data: CopyDto) {
    try {
      const copy = {
        copyId: null,
        publisherId: null,
      };

      const existingLocation = await this.prisma.location.findMany({
        where: data.location,
      });

      if (!existingLocation.length) {
        const newCopy = await this.prisma.location.create({
          data: data.location,
        });
        copy.copyId = newCopy.id;
      } else copy.copyId = existingLocation[0].id;

      const existingPublisher = await this.prisma.publisher.findMany({
        where: data.publisher,
      });

      if (!existingPublisher.length) {
        const newPublisher = await this.prisma.publisher.create({
          data: data.publisher,
        });
        copy.publisherId = newPublisher.id;
      } else copy.publisherId = existingPublisher[0].id;

      await this.prisma.copy.create({
        data: {
          code: data.code,
          condition: data.condition,
          locationId: copy.copyId,
          publisherId: copy.publisherId,
          bookId: data.bookId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error creating the copy, please verify the provided data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCopy(id: number, data: CopyDto) {
    const existingCopy = await this.prisma.copy.findUnique({
      where: { id },
    });

    if (!existingCopy) {
      throw new HttpException('Copy not found', HttpStatus.NOT_FOUND);
    }

    try {
      let locationId = existingCopy.locationId;

      if (data.location) {
        const existingLocation = await this.prisma.location.findFirst({
          where: data.location,
        });

        if (!existingLocation) {
          const newLocation = await this.prisma.location.create({
            data: data.location,
          });
          locationId = newLocation.id;
        } else {
          locationId = existingLocation.id;
        }
      }

      let publisherId = existingCopy.publisherId;

      if (data.publisher) {
        const existingPublisher = await this.prisma.publisher.findFirst({
          where: data.publisher,
        });

        if (!existingPublisher) {
          const newPublisher = await this.prisma.publisher.create({
            data: data.publisher,
          });
          publisherId = newPublisher.id;
        } else {
          publisherId = existingPublisher.id;
        }
      }

      await this.prisma.copy.update({
        where: { id },
        data: {
          code: data.code || existingCopy.code,
          condition: data.condition || existingCopy.condition,
          locationId,
          publisherId,
          bookId: data.bookId || existingCopy.bookId,
        },
      });

      return { message: 'Copy updated successfully.' };
    } catch (error) {
      throw new HttpException(
        'Error updating the copy, please verify the provided data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteCopy(id: number) {
    try {
      await this.prisma.copy.update({
        data: { isDeleted: true },
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        'Error updating the copy, please verify the provided data.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
