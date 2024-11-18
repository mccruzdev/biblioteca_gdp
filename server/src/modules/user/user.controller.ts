import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener los datos del usuario' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Token de autenticación',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario',
  })
  @ApiResponse({
    status: 403,
    description: 'Token no valido',
  })
  me(@Headers('authorization') authorization: string | undefined) {
    return this.userService.me(authorization);
  }
}
