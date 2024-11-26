import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokenManager } from 'src/common/token/token';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { RolesT } from 'src/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  tokenManager = new TokenManager(this.jwtService);

  canActivate(context: ExecutionContext) {
    const role = this.reflector.get<RolesT>(Roles, context.getHandler());

    if (!role) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = request.headers['authorization'];
    const data = this.tokenManager.getDataFromHeader(authorizationHeader);

    const roleHierarchy = {
      ADMIN: ['READER', 'LIBRARIAN', 'ADMIN'],
      LIBRARIAN: ['READER', 'LIBRARIAN'],
      READER: ['READER'],
    };

    return (roleHierarchy[data.role] || []).includes(role);
  }
}
