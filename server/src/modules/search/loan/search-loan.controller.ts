import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { SearchLoanService } from './search-loan.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles/roles.decorator';
import { LoanStatusT } from 'src/types';
import { Request } from 'express';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchLoanController {
  constructor(private readonly searchLoanService: SearchLoanService) {}

  @Get('loan-me-by-status/:status')
  @Roles('READER')
  getMyLoansByStatus(
    @Req() request: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('status') status: LoanStatusT,
  ) {
    return this.searchLoanService.getMyLoansByStatus(
      request,
      page,
      limit,
      status,
    );
  }

  @Get('loan-by-status/:status')
  @Roles('LIBRARIAN')
  getAllLoansByStatus(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('status') status: LoanStatusT,
  ) {
    return this.searchLoanService.getAllLoansByStatus(page, limit, status);
  }
}
