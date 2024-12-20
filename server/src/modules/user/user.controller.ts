import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { UpdateUserDTO } from './dto/update-user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @Roles('READER')
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

  @Get('all')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener los datos de todos los usuarios' })
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
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario',
  })
  @ApiResponse({
    status: 403,
    description: 'No autorizado',
  })
  getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.userService.getAllUsers(Number(page), Number(limit));
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar datos de usuario' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario a actualizar',
  })
  @ApiBody({
    type: UpdateUserDTO,
    examples: {
      example: {
        value: {
          role: 'LIBRARIAN',
          isDisabled: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
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
  @ApiResponse({
    status: 404,
    description: 'ID del usuario no encontrado',
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
  ) {
    return this.userService.updateUser(id, data);
  }
}
