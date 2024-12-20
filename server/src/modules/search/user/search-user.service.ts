import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/common/pagination/paginator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesT } from 'src/types';

const paginateUsersByDni: PaginateFunction = paginator({
  path: 'search/users-by-dni',
  limit: 10,
});

const paginateUsersByNames: PaginateFunction = paginator({
  path: 'search/users-by-name',
  limit: 10,
});

const paginateUsersByLastName: PaginateFunction = paginator({
  path: 'search/users-by-lastname',
  limit: 10,
});

const paginateUsersByPhoneNumber: PaginateFunction = paginator({
  path: 'search/users-by-phonenumber',
  limit: 10,
});

const paginateUsersByRole: PaginateFunction = paginator({
  path: 'search/users-by-role',
  limit: 10,
});

const paginateUsersByEmail: PaginateFunction = paginator({
  path: 'search/users-by-email',
  limit: 10,
});

const paginateUsersByEmailVerified: PaginateFunction = paginator({
  path: 'search/users-by-emailverified',
  limit: 10,
});

const paginateUsersByIsDisabled: PaginateFunction = paginator({
  path: 'search/users-by-isdisabled',
  limit: 10,
});

@Injectable()
export class SearchUserService {
  constructor(private prisma: PrismaService) {}

  selectUser = {
    id: true,
    dni: true,
    names: true,
    lastName: true,
    phoneNumber: true,
    role: true,
    email: true,
    emailVerified: true,
    isDisabled: true,
  };

  async getUsersByDni(page: number, limit: number, dni: string) {
    return paginateUsersByDni(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { dni: { contains: dni } },
      },
      { limit, page, path: `search/users-by-dni/${dni}` },
    );
  }

  async getUsersByNames(page: number, limit: number, name: string) {
    return paginateUsersByNames(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { names: { contains: name } },
      },
      { limit, page, path: `search/users-by-name/${name}` },
    );
  }

  async getUsersByLastName(page: number, limit: number, lastname: string) {
    return paginateUsersByLastName(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { lastName: { contains: lastname } },
      },
      { limit, page, path: `search/users-by-lastname/${lastname}` },
    );
  }

  async getUsersByPhoneNumber(
    page: number,
    limit: number,
    phonenumber: string,
  ) {
    return paginateUsersByPhoneNumber(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { phoneNumber: { contains: phonenumber } },
      },
      { limit, page, path: `search/users-by-phonenumber/${phonenumber}` },
    );
  }

  async getUsersByRole(page: number, limit: number, role: RolesT) {
    return paginateUsersByRole(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { role },
      },
      { limit, page, path: `search/users-by-role/${role}` },
    );
  }

  async getUsersByEmail(page: number, limit: number, email: string) {
    return paginateUsersByEmail(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { email: { contains: email } },
      },
      { limit, page, path: `search/users-by-email/${email}` },
    );
  }

  async getUsersByEmailVerified(
    page: number,
    limit: number,
    emailverified: boolean,
  ) {
    return paginateUsersByEmailVerified(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { emailVerified: emailverified },
      },
      { limit, page, path: `search/users-by-emailverified/${emailverified}` },
    );
  }

  async getUsersByIsDisabled(page: number, limit: number, isdisabled: boolean) {
    return paginateUsersByIsDisabled(
      this.prisma.user,
      {
        select: this.selectUser,
        where: { isDisabled: isdisabled },
      },
      { limit, page, path: `search/users-by-isdisabled/${isdisabled}` },
    );
  }
}
