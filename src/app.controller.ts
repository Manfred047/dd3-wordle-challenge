import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './auth/dto/login.dto';
import { AuthService } from './auth/auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @ApiTags('Auth')
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }
}
