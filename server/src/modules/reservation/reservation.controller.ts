import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';

@ApiTags('Reservation')
@ApiBearerAuth()
@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obtener una lista paginada de todas las reservas' })
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
    description: 'Lista paginada de todas las reservas',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getAllReservations(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.reservationService.getAllReservations(
      Number(page),
      Number(limit),
    );
  }

  @Get('/me')
  @Roles('READER')
  @ApiOperation({
    summary: 'Obtener una lista paginada de las reservas del usuario',
  })
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
    description: 'Lista paginada de las reservas del usuario',
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros invalidos',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getMyReservations(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.reservationService.getMyReservations(
      req.headers.authorization,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  @Roles('READER')
  @ApiOperation({ summary: 'Registrar reservaciones' })
  @ApiBody({
    type: CreateReservationDTO,
    examples: {
      example: {
        value: {
          dueDate: '2024-11-30T01:38:47.506Z',
          status: 'PENDING',
          copies: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada correctamente',
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
  registerReservation(@Req() req: Request, @Body() data: CreateReservationDTO) {
    return this.reservationService.registerReservation(
      req.headers.authorization,
      data,
    );
  }

  @Put(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Actualizar reservaciones' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del libro a actualizar',
  })
  @ApiBody({
    type: UpdateReservationDTO,
    examples: {
      example: {
        value: {
          dueDate: '2024-11-30T01:38:47.506Z',
          status: 'PENDING',
          copies: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada correctamente',
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
    description: 'Reserva o ID del ejemplar no encontrado',
  })
  updateReservation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReservationDTO,
  ) {
    return this.reservationService.updateReservation(id, data);
  }

  @Delete(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Eliminar reserva por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la reserva a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva eliminada correctamente',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrado',
  })
  deleteReservation(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.reservationService.deleteReservation(
      req.headers.authorization,
      id,
    );
  }
}
