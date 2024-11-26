import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenManager } from 'src/common/token/token';
import { PrismaService } from 'src/providers/prisma/prisma.service';

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
}
