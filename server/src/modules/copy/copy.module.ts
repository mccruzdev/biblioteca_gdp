import { Module } from '@nestjs/common';
import { CopyController } from './copy.controller';
import { CopyService } from './copy.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Module({
  controllers: [CopyController],
  providers: [
    CopyService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class CopyModule {}
