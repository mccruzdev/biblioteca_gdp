import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), BooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
