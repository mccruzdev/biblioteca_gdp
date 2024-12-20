import { Module } from '@nestjs/common';
import { SearchUserService } from './search-user.service';
import { SearchUserController } from './search-user.controller';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [SearchUserController],
  providers: [
    SearchUserService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class SearchUserModule {}
