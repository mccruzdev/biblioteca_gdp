import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Module({
  controllers: [LocationController],
  providers: [
    LocationService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class LocationModule {}
