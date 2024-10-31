import { Module } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { BookCategoryController } from './book-category.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [BookCategoryController],
  providers: [
    BookCategoryService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class BookCategoryModule {}
