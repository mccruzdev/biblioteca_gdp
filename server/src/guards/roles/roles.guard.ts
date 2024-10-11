import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { RolesT } from 'src/types';

interface TokenData {
  id: number;
  role: RolesT;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const role = this.reflector.get<RolesT>(Roles, context.getHandler());

    if (!role) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) return false;

    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) return false;

    let data: TokenData | null;

    try {
      data = this.jwtService.verify<TokenData>(token);
    } catch {
      return false;
    }

    if (!data || !data.role) return false;

    const roleHierarchy = {
      ADMIN: ['READER', 'LIBRARIAN', 'ADMIN'],
      LIBRARIAN: ['READER', 'LIBRARIAN'],
      READER: ['READER'],
    };

    return (roleHierarchy[data.role] || []).includes(role);
  }
}
