import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { DonationDTO } from './dto/donation.dto';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';

const paginate: PaginateFunction = paginator({
  path: 'donation',
  limit: 10,
});

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}

  async getAllDonations(page: number, limit: number) {
    return paginate(
      this.prisma.donation,
      {},
      { page, limit, path: 'donation' },
    );
  }

  async createDonation(data: DonationDTO) {
    try {
      await this.prisma.donation.create({
        data: {
          donorId: data.donorId,
          description: data.description,
          copies: { createMany: { data: data.copies } },
        },
      });
    } catch (error) {
      console.log(error);

      throw new HttpException('Duplicated data', HttpStatus.CONFLICT);
    }
  }

  async updateDonation(id: number, data: DonationDTO) {
    try {
      let locationIds: number[] = [];

      for (let i = 0; i < data.copies.length; i++) {
        const copy = data.copies[i];

        const _location = await this.prisma.location.findFirst({
          where: {
            shelf: copy.location.shelf,
            shelfColor: copy.location.shelfColor,
            shelfLevel: copy.location.shelfLevel,
          },
        });

        if (_location) {
          locationIds.push(_location.id);
          return;
        }

        const newLocation = await this.prisma.location.create({
          data: copy.location,
        });
        locationIds.push(newLocation.id);
      }

      let publisherIds: number[] = [];

      for (let i = 0; i < data.copies.length; i++) {
        const copy = data.copies[i];

        const _publisher = await this.prisma.publisher.findFirst({
          where: { name: copy.publisher.name, email: copy.publisher.email },
        });

        if (_publisher) {
          publisherIds.push(_publisher.id);
          return;
        }

        const newPublisher = await this.prisma.publisher.create({
          data: copy.publisher,
        });
        publisherIds.push(newPublisher.id);
      }

      await this.prisma.donation.update({
        where: { id },
        data: {
          donorId: data.donorId,
          description: data.description,
          copies: {
            deleteMany: {},
            create: data.copies.map((copy, index) => {
              return {
                code: copy.code,
                condition: copy.condition,
                locationId: locationIds[index],
                publisherId: publisherIds[index],
                bookId: copy.bookId,
              };
            }),
          },
        },
      });
    } catch {
      throw new HttpException('Duplicated data', HttpStatus.CONFLICT);
    }
  }

  async deleteDonation(id: number) {
    try {
      await this.prisma.donation.delete({
        where: { id },
      });
    } catch {
      throw new HttpException('Donation ID not found', HttpStatus.NOT_FOUND);
    }
  }
}
