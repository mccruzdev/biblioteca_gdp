import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchDonorService } from './search-donor.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchDonorController {
  constructor(private readonly searchDonorService: SearchDonorService) {}

  @Get('donor-by-name/:name')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener donadores por nombre' })
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
    description: 'Name',
  })
  @ApiResponse({
    status: 200,
    description: 'Donadores',
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
  getDonorsByName(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('name') name: string,
  ) {
    return this.searchDonorService.getDonorsByName(page, limit, name);
  }

  @Get('donor-by-email/:email')
  @Roles('LIBRARIAN')
  @ApiOperation({ summary: 'Obtener donadores por correo' })
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
    description: 'Email',
  })
  @ApiResponse({
    status: 200,
    description: 'Donadores',
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
  getDonorsByEmail(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('email') email: string,
  ) {
    return this.searchDonorService.getDonorsByEmail(page, limit, email);
  }
}
