import { Module } from '@nestjs/common';
import { SearchReservationService } from './search-reservation.service';
import { SearchReservationController } from './search-reservation.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Module({
  controllers: [SearchReservationController],
  providers: [
    SearchReservationService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SearchReservationModule {}
