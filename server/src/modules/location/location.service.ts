import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { LocationDTO } from './dto/location.dto';

const paginate: PaginateFunction = paginator({
  path: 'location',
  limit: 10,
});

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async getAllLocation(page: number, limit: number) {
    return paginate(this.prisma.location, {}, { page, limit });
  }

  async createLocation(location: LocationDTO) {
    try {
      return await this.prisma.location.create({
        data: location,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to create location',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateLocation(id: number, location: LocationDTO) {
    try {
      const existingLocation = await this.prisma.location.findUnique({
        where: { id },
      });
      if (!existingLocation) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.location.update({
        where: { id },
        data: location,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to update location',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteLocation(id: number) {
    try {
      const existingLocation = await this.prisma.location.findUnique({
        where: { id },
      });
      if (!existingLocation) {
        throw new HttpException('Location not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.location.delete({ where: { id } });
      return;
    } catch (error) {
      throw new HttpException(
        'Failed to delete location',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
