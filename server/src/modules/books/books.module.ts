import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class BooksModule {}
