import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/book/book.module';
import { LocationModule } from './modules/location/location.module';
import { BookCategoryModule } from './modules/book-category/book-category.module';
import { UserModule } from './modules/user/user.module';
import { CopyModule } from './modules/copy/copy.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { LoanModule } from './modules/loan/loan.module';
import { AuthorModule } from './modules/author/author.module';
import { DonorModule } from './modules/donor/donor.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    AuthModule,
    AuthorModule,
    BookCategoryModule,
    BooksModule,
    ConfigModule.forRoot(),
    CopyModule,
    DonorModule,
    LoanModule,
    LocationModule,
    ReservationModule,
    SearchModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
