import { Module } from '@nestjs/common';
import { SearchBooksModule } from './books/search-books.module';
import { SearchDonationModule } from './donation/search-donation.module';

@Module({
  imports: [SearchBooksModule, SearchDonationModule],
})
export class SearchModule {}
