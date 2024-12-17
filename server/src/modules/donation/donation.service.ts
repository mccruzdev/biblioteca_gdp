import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { DonationDTO } from './dto/donation.dto';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import {
  transformDonationCopiesArray,
  transformDonations,
} from 'src/transformers/donation';

const paginateDonation: PaginateFunction = paginator({
  path: 'donation',
  limit: 10,
});

const paginateDonationCopies: PaginateFunction = paginator({
  path: 'donation/1/copies',
  limit: 10,
});

@Injectable()
export class DonationService {
  constructor(private prisma: PrismaService) {}

  async getAllDonations(page: number, limit: number) {
    return paginateDonation(
      this.prisma.donation,
      {
        select: {
          id: true,
          date: true,
          description: true,
          Donor: true,
        },
      },
      { page, limit, path: 'donation' },
      transformDonations,
    );
  }

  async donationBooks(donationId: number, page: number, limit: number) {
    return paginateDonationCopies(
      this.prisma.donation,
      {
        select: {
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
                  authors: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
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
        },
        where: { id: donationId },
      },
      { page, limit, path: `donation/${donationId}/copies` },
      transformDonationCopiesArray,
    );
  }

  async createDonation(data: DonationDTO) {
    try {
      const locationPromises = data.copies.map(async (copy) => {
        const existingLocation = await this.prisma.location.findFirst({
          where: copy.location,
        });
        return existingLocation
          ? existingLocation.id
          : (await this.prisma.location.create({ data: copy.location })).id;
      });

      const publisherPromises = data.copies.map(async (copy) => {
        const existingPublisher = await this.prisma.publisher.findFirst({
          where: copy.publisher,
        });
        return existingPublisher
          ? existingPublisher.id
          : (await this.prisma.publisher.create({ data: copy.publisher })).id;
      });

      const [locationIds, publisherIds] = await Promise.all([
        Promise.all(locationPromises),
        Promise.all(publisherPromises),
      ]);

      await this.prisma.donation.create({
        data: {
          donorId: data.donorId,
          description: data.description,
          copies: {
            createMany: {
              data: data.copies.map((copy, index) => ({
                code: copy.code,
                condition: copy.condition,
                bookId: copy.bookId,
                locationId: locationIds[index],
                publisherId: publisherIds[index],
              })),
            },
          },
        },
      });
    } catch {
      throw new HttpException('Hay datos duplicados', HttpStatus.CONFLICT);
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
