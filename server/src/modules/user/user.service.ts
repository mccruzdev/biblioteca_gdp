import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';

const paginateAll: PaginateFunction = paginator({
  path: 'user/all',
  limit: 10,
});

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  tokenManager = new TokenManager(this.jwtService);

  async me(authorization: string | undefined) {
    const data = this.tokenManager.getDataFromHeader(authorization);

    const user = await this.prisma.user.findUnique({
      select: {
        dni: true,
        names: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        email: true,
      },
      where: { id: data.id },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return user;
  }

  async getAllUsers(page: number, limit: number) {
    return paginateAll(
      this.prisma.user,
      {
        select: {
          id: true,
          dni: true,
          names: true,
          lastName: true,
          phoneNumber: true,
          role: true,
          email: true,
          emailVerified: true,
          isDisabled: true,
        },
      },
      { page, limit, path: 'user/all' },
    );
  }

  async updateUser(id: number, data: UpdateUserDTO) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (user.isSuperUser)
        throw new HttpException(
          'No puedes editar un super usuario',
          HttpStatus.FORBIDDEN,
        );

      await this.prisma.user.update({
        data: { role: data.role, isDisabled: data.isDisabled },
        where: { id },
      });
    } catch {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
