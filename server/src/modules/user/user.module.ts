import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class UserModule {}
