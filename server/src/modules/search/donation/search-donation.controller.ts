import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchDonationService } from './search-donation.service';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchDonationController {
  constructor(private searchService: SearchDonationService) {}

  @Get('donation-by-description/:description')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener donaciones por descripción' })
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
    name: 'description',
    type: String,
    description: 'Descripción',
  })
  @ApiResponse({
    status: 200,
    description: 'Donaciones',
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
  getDonationByDescription(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('description') description: string,
  ) {
    return this.searchService.getDonationByDescription(
      page,
      limit,
      description,
    );
  }

  @Get('donation-by-donor/:donorName')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener donaciones por nombre de donante' })
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
    name: 'donorName',
    type: String,
    description: 'Nombre del donante',
  })
  @ApiResponse({
    status: 200,
    description: 'Donaciones',
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
  getDonationByDonorName(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('donorName') name: string,
  ) {
    return this.searchService.getDonationByDonorName(page, limit, name);
  }

  @Get('donation-by-copycode/:copyCode')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener donaciones por codigo de copia donada' })
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
    name: 'copyCode',
    type: String,
    description: 'Codigo de la copia donada',
  })
  @ApiResponse({
    status: 200,
    description: 'Donaciones',
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
  getDonationByCopyCode(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('copyCode') code: string,
  ) {
    return this.searchService.getDonationByCopyCode(page, limit, code);
  }

  @Get('donation-by-book/:book')
  @Roles('LIBRARIAN')
  getDonationByBook(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('book') book: string,
  ) {
    return this.searchService.getDonationByBook(page, limit, book);
  }
}
