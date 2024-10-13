import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksTemplateModule } from './modules/books-template/books-template.module';
import { LocationModule } from './modules/location/location.module';

@Module({
  imports: [
    AuthModule,
    BooksTemplateModule,
    ConfigModule.forRoot(),
    LocationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
