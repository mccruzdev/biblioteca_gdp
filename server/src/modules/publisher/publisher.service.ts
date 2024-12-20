import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { PublisherDTO } from './dto/publisher.dto';

const paginate: PaginateFunction = paginator({
  path: 'publisher',
  limit: 10,
});

@Injectable()
export class PublisherService {
  constructor(private prisma: PrismaService) {}

  async getAllPublishers(page: number, limit: number) {
    return paginate(
      this.prisma.publisher,
      {},
      { page, limit, path: 'publisher' },
    );
  }

  async createPublisher(data: PublisherDTO) {
    try {
      await this.prisma.publisher.create({ data });
    } catch {
      throw new HttpException('Datos duplicados', HttpStatus.CONFLICT);
    }
  }

  async updatePublisher(id: number, data: PublisherDTO) {
    try {
      await this.prisma.publisher.update({ data, where: { id } });
    } catch {
      throw new HttpException('Datos duplicados', HttpStatus.CONFLICT);
    }
  }

  async deletePublisher(id: number) {
    try {
      await this.prisma.publisher.delete({ where: { id } });
    } catch {
      throw new HttpException('ID no encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
