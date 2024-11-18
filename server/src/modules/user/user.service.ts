import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { TokenData } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async me(authorization: string | undefined) {
    if (!authorization)
      throw new HttpException(
        'Authorization header is missing',
        HttpStatus.FORBIDDEN,
      );

    const token = authorization.split(' ')[1];
    if (!token)
      throw new HttpException(
        'Token is missing in Authorization header',
        HttpStatus.FORBIDDEN,
      );

    let data: TokenData | null;

    try {
      data = this.jwtService.verify<TokenData>(token);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.user.findUnique({
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
  }
}
