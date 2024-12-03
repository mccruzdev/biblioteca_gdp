import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { AuthorDTO } from './dto/author.dto';

const paginate: PaginateFunction = paginator({
  path: 'author',
  limit: 10,
});

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async getAllAuthors(page: number, limit: number) {
    return paginate(this.prisma.author, {}, { page, limit, path: 'author' });
  }

  async createAuthor(data: AuthorDTO) {
    try {
      await this.prisma.author.create({ data });
    } catch {
      throw new HttpException('Datos invalidos', HttpStatus.CONFLICT);
    }
  }

  async updateAuthor(id: number, data: AuthorDTO) {
    try {
      await this.prisma.author.update({ where: { id }, data });
    } catch {
      throw new HttpException(
        'Datos invalidos o ID no encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteAuthor(id: number) {
    try {
      await this.prisma.author.delete({ where: { id } });
    } catch {
      throw new HttpException('ID no encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
