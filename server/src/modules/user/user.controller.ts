import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener los datos del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado',
  })
  me(@Req() req: Request) {
    return this.userService.me(req.headers.authorization);
  }
}
