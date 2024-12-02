import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksTemplateModule } from './modules/book/book.module';
import { LocationModule } from './modules/location/location.module';
import { BookCategoryModule } from './modules/book-category/book-category.module';
import { UserModule } from './modules/user/user.module';
import { CopyModule } from './modules/copy/copy.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { LoanModule } from './modules/loan/loan.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    BooksTemplateModule,
    LocationModule,
    BookCategoryModule,
    UserModule,
    CopyModule,
    ReservationModule,
    LoanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
