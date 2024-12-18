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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoanService } from './loan.service';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Request } from 'express';
import { CreateLoanDTO } from './dto/create-loan.dto';
import { UpdateLoanDTO } from './dto/update-loan.dto';

@ApiTags('Loan')
@ApiBearerAuth()
@Controller('loan')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obtener una lista paginada de todos los prestamos',
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
    description: 'Lista paginada de todos los prestamos',
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
  getAllLoans(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.loanService.getAllLoans(Number(page), Number(limit));
  }

  @Get('/me')
  @Roles('READER')
  @ApiOperation({
    summary: 'Obtener una lista paginada de todos los prestamos del usuario',
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
    description: 'Lista paginada de los prestamos del usuario',
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
    return this.loanService.getMyReservations(
      req.headers.authorization,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  @Roles('READER')
  @ApiOperation({ summary: 'Registrar prestamos' })
  @ApiBody({
    type: CreateLoanDTO,
    examples: {
      example: {
        value: {
          dueDate: '2024-11-30T01:38:47.506Z',
          status: 'ACTIVE',
          copies: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Prestamo creado correctamente',
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
  registerLoan(@Req() req: Request, @Body() data: CreateLoanDTO) {
    return this.loanService.registerLoan(req.headers.authorization, data);
  }

  @Put(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Actualizar prestamos' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del libro a actualizar',
  })
  @ApiBody({
    type: UpdateLoanDTO,
    examples: {
      example: {
        value: {
          dueDate: '2024-11-30T01:38:47.506Z',
          status: 'ACTIVE',
          copies: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Prestamo actualizado correctamente',
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
    description: 'Prestamo o ID del ejemplar no encontrado',
  })
  updateLoan(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateLoanDTO,
  ) {
    return this.loanService.updateLoan(req.headers.authorization, id, data);
  }

  @Delete(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Eliminar préstamo por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del préstamo a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Prestamo eliminado correctamente',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  @ApiResponse({
    status: 404,
    description: 'Préstamo no encontrado',
  })
  deleteLoan(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    return this.loanService.deleteLoan(req.headers.authorization, id);
  }
}
