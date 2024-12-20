import { Module } from '@nestjs/common';
import { SearchBooksService } from './search-books.service';
import { SearchBooksController } from './search-books.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SearchBooksController],
  providers: [
    SearchBooksService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SearchBooksModule {}
