import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DonorDto } from './dto/donor.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';

const paginate: PaginateFunction = paginator({
  path: 'donor',
  limit: 10,
});

@Injectable()
export class DonorService {
  constructor(private prisma: PrismaService) {}

  async getAllDonors(page: number, limit: number) {
    return paginate(this.prisma.donor, {}, { page, limit, path: 'donor' });
  }

  async createDonor(data: DonorDto) {
    try {
      await this.prisma.donor.create({ data });
    } catch {
      throw new HttpException('Datos invalidos', HttpStatus.CONFLICT);
    }
  }

  async updateDonor(id: number, data: DonorDto) {
    try {
      await this.prisma.donor.update({ where: { id }, data });
    } catch {
      throw new HttpException(
        'Datos invalidos o ID no encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDonor(id: number) {
    try {
      await this.prisma.donor.delete({ where: { id } });
    } catch {
      throw new HttpException('ID no encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
