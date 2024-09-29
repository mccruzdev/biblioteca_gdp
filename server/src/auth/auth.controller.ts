import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('lookup-dni/:dni')
  lookupDNI(@Param() dni: string) {
    return this.auth.getUserDataPerDNI(dni);
  }

  @Post('create')
  createUser(@Body() user: CreateUserDTO) {
    return this.auth.createReaderUser(user);
  }

  @Post('login')
  loginUser(@Body() user: LoginUserDTO) {
    return this.auth.loginUser(user);
  }
}
