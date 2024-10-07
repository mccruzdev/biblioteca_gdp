import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [AuthModule, BooksModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
