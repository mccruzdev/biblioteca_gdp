import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class BooksModule {}
