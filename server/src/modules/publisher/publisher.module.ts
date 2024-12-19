import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [PublisherController],
  providers: [
    PublisherService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class PublisherModule {}
