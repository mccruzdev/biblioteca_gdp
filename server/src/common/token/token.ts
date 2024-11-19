import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from 'src/types';

export class TokenManager {
  constructor(private jwtService: JwtService) {}

  getDataFromHeader(authorization?: string) {
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

    return this.getData(token);
  }

  getData(token: string) {
    let data: TokenData | null;

    try {
      data = this.jwtService.verify<TokenData>(token);
    } catch {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    return data;
  }
}
