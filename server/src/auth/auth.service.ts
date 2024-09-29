import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UserReniec } from 'src/entities/user-reniec.entity';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
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

  async _hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
