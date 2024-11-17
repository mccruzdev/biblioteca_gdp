import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksTemplateModule } from './modules/book/book.module';
import { LocationModule } from './modules/location/location.module';
import { BookCategoryModule } from './modules/book-category/book-category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    BooksTemplateModule,
    LocationModule,
    BookCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
