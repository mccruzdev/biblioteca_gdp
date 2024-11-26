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
import { CopyService } from './copy.service';
import { CopyDto } from './dto/create-copy.dto';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Copies')
@ApiBearerAuth()
@Controller('copy')
export class CopyController {
  constructor(private copyService: CopyService) {}

  @Get(':id')
  @Roles('READER')
  @ApiOperation({ summary: 'Retorna todas las copias de un libro' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Resultado por páginas',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del libro',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve las copias de un libro',
  })
  @ApiResponse({
    status: 404,
    description: 'Copias no encontradas',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  getAllCopiesOfBook(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.copyService.getAllCopiesOfBook(Number(page), Number(limit), id);
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Crear una copia de un libro' })
  @ApiBody({
    type: CopyDto,
    examples: {
      example: {
        value: {
          code: '12345ABC',
          condition: 'NEW',
          location: {
            shelf: 'A1',
            shelfColor: 'Red',
            shelfLevel: 'Top',
          },
          publisher: {
            name: 'Editorial Example',
            email: 'contact@example.com',
            country: 'USA',
            address: '123 Main St, Springfield, IL',
            phoneNumber: '+1234567890',
            website: 'https://example.com',
          },
          bookId: 101,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Copia creada con éxito',
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
  createCopy(@Body() data: CopyDto): Promise<void> {
    return this.copyService.createCopy(data);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar una copia de un libro' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la copia',
  })
  @ApiBody({
    type: CopyDto,
    examples: {
      example: {
        value: {
          code: '12345ABC',
          condition: 'NEW',
          location: {
            shelf: 'A1',
            shelfColor: 'Red',
            shelfLevel: 'Top',
          },
          publisher: {
            name: 'Editorial Example',
            email: 'contact@example.com',
            country: 'USA',
            address: '123 Main St, Springfield, IL',
            phoneNumber: '+1234567890',
            website: 'https://example.com',
          },
          bookId: 101,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Copia actualizada con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos invalidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Copia no encontrada',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  updateCopy(@Param('id', ParseIntPipe) id: number, @Body() data: CopyDto) {
    return this.copyService.updateCopy(id, data);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Elimina una copia de un libro' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la copia',
  })
  @ApiResponse({
    status: 200,
    description: 'Copia eliminada con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Copia no encontrada',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: You do not have permission to access this resource',
  })
  deleteCopy(@Param('id', ParseIntPipe) id: number) {
    return this.copyService.deleteCopy(id);
  }
}
