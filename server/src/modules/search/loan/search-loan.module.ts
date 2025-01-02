import { Module } from '@nestjs/common';
import { SearchLoanService } from './search-loan.service';
import { SearchLoanController } from './search-loan.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [SearchLoanController],
  providers: [
    SearchLoanService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SearchLoanModule {}
