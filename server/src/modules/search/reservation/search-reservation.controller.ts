import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { SearchReservationService } from './search-reservation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { Request } from 'express';
import { ReservationStatus } from 'src/types';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchReservationController {
  constructor(
    private readonly searchReservationService: SearchReservationService,
  ) {}

  @Get('reservation-me-by-status/:status')
  @Roles('READER')
  getMyReservationsByStatus(
    @Req() request: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('status') status: ReservationStatus,
  ) {
    return this.searchReservationService.getMyReservationsByStatus(
      request,
      page,
      limit,
      status,
    );
  }

  @Get('reservation-by-status/:status')
  @Roles('LIBRARIAN')
  getAllReservationsByStatus(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('status') status: ReservationStatus,
  ) {
    return this.searchReservationService.getAllReservationsByStatus(
      page,
      limit,
      status,
    );
  }
}
