import { Module } from '@nestjs/common';
import { BooksTemplateService } from './book.service';
import { BooksTemplateController } from './book.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [BooksTemplateController],
  providers: [
    BooksTemplateService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class BooksTemplateModule {}
