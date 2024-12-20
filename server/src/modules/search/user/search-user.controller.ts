import { Controller, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { SearchUserService } from './search-user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { RolesT } from 'src/types';
import { ValidateRolePipe } from 'src/pipes/validate-role/validate-role.pipe';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchUserController {
  constructor(private readonly searchUserService: SearchUserService) {}

  @Get('user-by-dni/:dni')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios por dni' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'dni',
    type: String,
    description: 'DNI',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByDni(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('dni') dni: string,
  ) {
    return this.searchUserService.getUsersByDni(page, limit, dni);
  }

  @Get('user-by-name/:name')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios por nombre' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'name',
    type: String,
    description: 'Nombre',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByNames(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('name') name: string,
  ) {
    return this.searchUserService.getUsersByNames(page, limit, name);
  }

  @Get('user-by-lastname/:lastname')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios por apellidos' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'lastname',
    type: String,
    description: 'Apellidos',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByLastName(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('lastname') lastname: string,
  ) {
    return this.searchUserService.getUsersByLastName(page, limit, lastname);
  }

  @Get('user-by-phonenumber/:phonenumber')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios por número de teléfono' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'phonenumber',
    type: String,
    description: 'Número de teléfono',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByPhoneNumber(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('phonenumber') phonenumber: string,
  ) {
    return this.searchUserService.getUsersByPhoneNumber(
      page,
      limit,
      phonenumber,
    );
  }

  @Get('user-by-role/:role')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios por rol' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'role',
    type: String,
    description: 'Rol',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByRole(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('role', ValidateRolePipe) role: RolesT,
  ) {
    return this.searchUserService.getUsersByRole(page, limit, role);
  }

  @Get('user-by-email/:email')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios por correo' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Correo',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByEmail(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('email') email: string,
  ) {
    return this.searchUserService.getUsersByEmail(page, limit, email);
  }

  @Get('user-by-emailverified/:emailverified')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios con correo verificado' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'emailverified',
    type: String,
    description: 'Correo confirmado',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByEmailVerified(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('emailverified', ParseBoolPipe) emailverified: boolean,
  ) {
    return this.searchUserService.getUsersByEmailVerified(
      page,
      limit,
      emailverified,
    );
  }

  @Get('user-by-isdisabled/:isdisabled')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener usuarios desabilitados' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Número de la página',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Resultados por página',
    required: false,
  })
  @ApiParam({
    name: 'isdisabled',
    type: String,
    description: 'Está deshabilitado',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getUsersByIsDisabled(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('isdisabled', ParseBoolPipe) isdisabled: boolean,
  ) {
    return this.searchUserService.getUsersByIsDisabled(page, limit, isdisabled);
  }
}
