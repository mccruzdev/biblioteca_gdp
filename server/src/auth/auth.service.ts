import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserReniec } from 'src/entities/user-reniec.entity';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async getUserDataPerDNI(dni: string) {
    // TODO: Implement CSRF token and CORS.

    const response = await fetch(
      `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`,
      {
        headers: {
          Authorization: this.configService.get<string>('APIS_NET_PE_KEY'),
        },
      },
    );

    if (response.status === 422)
      throw new HttpException('The DNI is invalid.', HttpStatus.BAD_REQUEST);
    if (response.status === 404)
      throw new HttpException('The DNI was not found.', HttpStatus.NOT_FOUND);
    else if (!response.ok)
      throw new HttpException(
        'The service is unavailable.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );

    return (await response.json()) as UserReniec;
  }

  async createReaderUser(user: CreateUserDTO) {
    const hashedPassword = await this._hashPassword(user.password);

    try {
      await this.prisma.user.create({
        data: {
          dni: user.dni,
          email: user.email,
          names: user.names,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          password: hashedPassword,
          role: 'READER',
        },
      });
    } catch {
      throw new HttpException('User already exists.', HttpStatus.CONFLICT);
    }
  }

  async loginUser(user: LoginUserDTO) {
    const userRes = await this.prisma.user.findUnique({
      where: { dni: user.dni },
      select: { id: true, password: true, role: true },
    });

    if (!userRes)
      throw new HttpException('User not exists.', HttpStatus.NOT_FOUND);

    if (!(await this._comparePassword(userRes.password, user.password)))
      throw new HttpException('User not exists.', HttpStatus.UNAUTHORIZED);

    return {
      token: await this.jwt.signAsync({ id: userRes.id, role: userRes.role }),
    };
  }

  async _hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async _comparePassword(hashed: string, plain: string) {
    return await bcrypt.compare(plain, hashed);
  }
}
