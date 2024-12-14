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
import { DonationService } from './donation.service';
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
import { DonationDTO } from './dto/donation.dto';

@ApiTags('Donation')
@ApiBearerAuth()
@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener una lista paginada de las donaciones' })
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
    description: 'Lista paginada de todas las donaciones',
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
  getAllDonations(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.donationService.getAllDonations(Number(page), Number(limit));
  }

  @Post()
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Crear una nueva donación' })
  @ApiBody({
    type: DonationDTO,
    examples: {
      example: {
        value: {
          donorId: 2,
          description: 'Donación de libros de informática',
          copies: [
            {
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
          ],
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
  createDonation(@Body() data: DonationDTO) {
    return this.donationService.createDonation(data);
  }

  @Put(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Actualizar donación' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la donación a actualizar',
  })
  @ApiBody({
    type: DonationDTO,
    examples: {
      example: {
        value: {
          donorId: 2,
          description: 'Donación de libros de informática',
          copies: [
            {
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
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Donación actualizada correctamente',
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
    description: 'ID de la donación no encontrada',
  })
  updateDonation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DonationDTO,
  ) {
    return this.donationService.updateDonation(id, data);
  }

  @Delete(':id')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Eliminar donación' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la donación a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Donación eliminada correctamente',
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
    description: 'ID de la donación no encontrado',
  })
  deleteDonation(@Param('id', ParseIntPipe) id: number) {
    return this.donationService.deleteDonation(id);
  }
}
