import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ReservationModule {}
