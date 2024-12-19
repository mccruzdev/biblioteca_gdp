import { Module } from '@nestjs/common';
import { SearchDonationController } from './search-donation.controller';
import { SearchDonationService } from './search-donation.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule],
  controllers: [SearchDonationController],
  providers: [
    SearchDonationService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SearchDonationModule {}
