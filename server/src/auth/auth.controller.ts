import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('lookup-dni/:dni')
  @ApiOperation({ summary: 'Consulta datos de usuario por DNI' })
  @ApiParam({
    name: 'dni',
    description: 'DNI del usuario a consultar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario obtenidos exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'El DNI no fue encontrado.' })
  @ApiResponse({ status: 400, description: 'El DNI es inválido.' })
  @ApiResponse({ status: 503, description: 'El servicio no está disponible.' })
  lookupDNI(@Param() dni: string) {
    return this.auth.getUserDataPerDNI(dni);
  }

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo usuario lector' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe.' })
  createUser(@Body() user: CreateUserDTO) {
    return this.auth.createReaderUser(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso. Token JWT devuelto.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  loginUser(@Body() user: LoginUserDTO) {
    return this.auth.loginUser(user);
  }
}
