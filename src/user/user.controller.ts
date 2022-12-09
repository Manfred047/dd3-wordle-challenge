import { Controller, Post, Body, Get, Request, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInterface } from './interfaces/user.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserWordDto } from './dto/user-word.dto';
import { UserIdDto } from './dto/user-id.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Permite crear un nuevo usuario.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtiene la información de la sesión del usuario actual.',
  })
  @Get()
  getMyUser(@Request() request: Record<any, any>): UserInterface {
    return request.$user;
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Ingresa una palabra para iniciar/continuar el juego.',
  })
  @Post('current-game-result')
  getCurrentGameResult(
    @Body() userWordDto: UserWordDto,
    @Request() request: Record<any, any>,
  ) {
    const authUser = request.$user as UserInterface;
    const { userWord } = userWordDto;
    return this.userService.compareUserWords(userWord);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Obtiene cuantas partidas a jugado un usuario y cuantas victorias ha tenido.',
  })
  @Get('summary-game/:user_id')
  async summaryUserChallenges(@Param() userIdDto: UserIdDto) {
    const { userId } = userIdDto;
    return this.userService.summaryUserChallenges(userId);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtiene los mejores 10 jugadores con su número de victorias.',
  })
  @Get('top-players')
  async getTopPlayers() {
    return await this.userService.getTopPlayers();
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obtiene las palabras más acertadas (1).',
  })
  @Get('top-word')
  async getTopWord() {
    return this.userService.getTopWord();
  }
}
