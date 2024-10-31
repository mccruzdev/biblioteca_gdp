import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { PasswordChangedDTO } from './dto/password-change.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { ConfirmPasswordChange } from './dto/confirm-password-change.dto';

@ApiTags('Auth')
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
  lookupDNI(@Param() dni: { dni: string }) {
    return this.auth.getUserDataPerDNI(dni.dni);
  }

  @Get('confirm-email')
  @ApiOperation({ summary: 'Confirmar el correo' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Token for email verification',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Email successfully verified' })
  @ApiResponse({
    status: 400,
    description: 'Invalid token or user not found, or account already verified',
  })
  @ApiResponse({ status: 403, description: 'Token has expired' })
  confirmAccount(@Query() query: { token: string | undefined }) {
    return this.auth.confirmAccount(query);
  }

  @Post('create-user')
  @ApiOperation({ summary: 'Crear un nuevo usuario lector' })
  @ApiBody({
    type: CreateUserDTO,
    examples: {
      example: {
        value: {
          dni: '12345678',
          password: 'MyPassword123%&',
          email: 'example@gmail.com',
          names: 'Jhon',
          lastName: 'Doe',
          phoneNumber: '987654321',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe.' })
  createUser(@Body() user: CreateUserDTO) {
    return this.auth.createReaderUser(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({
    type: LoginUserDTO,
    examples: {
      example: {
        value: {
          dni: '12345678',
          password: 'MyPassword123%&',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso. Token JWT devuelto.',
  })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  loginUser(@Body() user: LoginUserDTO) {
    return this.auth.loginUser(user);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refrescar el token de registro' })
  @ApiBody({
    type: RefreshTokenDTO,
    examples: {
      example: {
        value: {
          dni: '12345678',
          password: 'MyPassword123%&',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Token de registro refrescado.' })
  @ApiResponse({ status: 404, description: 'El usuario no existe.' })
  refreshToken(@Body() user: RefreshTokenDTO) {
    return this.auth.refreshRegisterToken(user);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Solicitar cambio de contraseña' })
  @ApiBody({
    type: PasswordChangedDTO,
    examples: {
      example: {
        value: {
          dni: '12345678',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de cambio de contraseña realizada.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  requestPasswordChange(@Body() user: PasswordChangedDTO) {
    return this.auth.requestPasswordChange(user);
  }

  @Post('confirm-change-password')
  @ApiOperation({ summary: 'Confirmar cambio de contraseña' })
  @ApiBody({
    type: ConfirmPasswordChange,
    examples: {
      example: {
        value: {
          token: '<enter-your-token-here-that-was-sent-by-email>',
          password: 'MyPassword123%&',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Token inválido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  confirmPasswordChange(@Body() data: ConfirmPasswordChange) {
    return this.auth.confirmPasswordChange(data);
  }
}
