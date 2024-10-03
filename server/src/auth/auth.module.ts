import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { NodemailerService } from 'src/providers/nodemailer/nodemailer.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, NodemailerService],
})
export class AuthModule {}
