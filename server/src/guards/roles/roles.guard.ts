import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenManager } from 'src/common/token/token';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesT } from 'src/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  tokenManager = new TokenManager(this.jwtService);

  async canActivate(context: ExecutionContext) {
    const role = this.reflector.get<RolesT>(Roles, context.getHandler());

    if (!role) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = request.headers['authorization'];
    const data = this.tokenManager.getDataFromHeader(authorizationHeader);

    const user = await this.prisma.user.findUnique({ where: { id: data.id } });

    if (user.isDisabled) return false;

    const roleHierarchy = {
      ADMIN: ['READER', 'LIBRARIAN', 'ADMIN'],
      LIBRARIAN: ['READER', 'LIBRARIAN'],
      READER: ['READER'],
    };

    return (roleHierarchy[data.role] || []).includes(role);
  }
}
