import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './auth/dto/login.dto';
import { AuthService } from './auth/auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WordsService } from './words/words.service';
import { Cron } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly wordService: WordsService,
  ) {}

  @ApiTags('Auth')
  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @ApiTags('Carga de diccionario')
  @ApiOperation({
    summary:
      'Carga del diccionario de datos, esta operación puede tardar mucho.',
  })
  @Post('load-words')
  async loadWords() {
    await this.wordService.saveWordDictionary();
    return { success: 'ok' };
  }

  @Cron('*/5 * * * *', { name: 'refreshSelectedWord' })
  async refreshSelectedWord(): Promise<void> {
    await this.wordService.regenerateSelectedWord();
  }
}
