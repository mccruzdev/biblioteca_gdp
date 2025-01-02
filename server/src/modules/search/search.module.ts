import { Module } from '@nestjs/common';
import { SearchBooksModule } from './books/search-books.module';
import { SearchDonationModule } from './donation/search-donation.module';
import { SearchUserModule } from './user/search-user.module';
import { SearchDonorModule } from './donor/search-donor.module';
import { SearchReservationModule } from './reservation/search-reservation.module';
import { SearchLoanModule } from './loan/search-loan.module';

@Module({
  imports: [
    SearchBooksModule,
    SearchDonationModule,
    SearchUserModule,
    SearchDonorModule,
    SearchReservationModule,
    SearchLoanModule,
  ],
})
export class SearchModule {}
