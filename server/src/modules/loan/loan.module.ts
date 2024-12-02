import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [LoanController],
  providers: [
    LoanService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class LoanModule {}
