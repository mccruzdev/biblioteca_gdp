import { Module } from '@nestjs/common';
import { SearchBooksModule } from './books/search-books.module';
import { SearchDonationModule } from './donation/search-donation.module';
import { SearchUserModule } from './user/search-user.module';

@Module({
  imports: [SearchBooksModule, SearchDonationModule, SearchUserModule],
})
export class SearchModule {}
