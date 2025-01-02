import { Module } from '@nestjs/common';
import { SearchDonorService } from './search-donor.service';
import { SearchDonorController } from './search-donor.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule],
  controllers: [SearchDonorController],
  providers: [
    SearchDonorService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SearchDonorModule {}
