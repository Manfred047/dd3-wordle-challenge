import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Helper } from '../helpers/helper';
import { WordsService } from '../words/words.service';
import * as _ from 'lodash';
import { UserChallengesEntity } from './entities/user-challenges.entity';
import { instanceToPlain } from 'class-transformer';
import { UserInterface } from './interfaces/user.interface';
import { TopPlayersInterface } from '../words/interfaces/top-players.interface';
import { TopWordsInterface } from '../words/interfaces/top-words.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserChallengesEntity)
    private readonly userChallengesRepository: Repository<UserChallengesEntity>,
    private readonly wordsService: WordsService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const userEntity: UserEntity = new UserEntity(createUserDto);
      return await this.userRepository.save<UserEntity>(userEntity);
    } catch (exception) {
      Logger.error(
        `Error en servicio <${UserService.name}> función <create>`,
        exception.message,
      );
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({
      email: Like(email),
    });
  }

  async findOneByToken(token: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({
      token: Like(token),
    });
  }

  async setUserToken(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.token = Helper.nanoId();
    return this.userRepository.save(userEntity);
  }

  async compareUserWords(userWord: string) {
    const selectedWordEntity = await this.wordsService.getCurrentSelectedWord();
    const currentWordArray = _.split(selectedWordEntity.word, '');
    const userWordArray = _.split(userWord, '');
    const userWordArraySize = _.size(userWordArray);
    console.log(currentWordArray);
    _.forEach(userWord, (word, key) => {
      const currentWordIdx = _.findIndex(
        selectedWordEntity.word,
        (cwa) => cwa === word,
      );
      // console.log(word, key);
      console.log(currentWordIdx);
    });
    /*for (let i = 0; i < userWordArraySize; i++) {
      const userLetter = userWordArray[i];
      console.log(userLetter);
      const currentWordIdx = _.findIndex(
        selectedWordEntity.word,
        (cwa) => cwa === userLetter,
      );
      console.log(currentWordIdx);
    }*/
    return userWordArraySize;
  }

  async summaryUserChallenges(userId: string): Promise<UserInterface> {
    const userEntity = await this.userRepository.findOneBy({
      id: Like(userId),
    });
    if (_.isEmpty(userEntity)) {
      throw new NotFoundException('User not found', 'user_not_found');
    }
    userEntity.numOfGames = await this.getUserNumOfGames(userId);
    userEntity.numOfVictories = await this.getCountUserVictories(userId);
    return instanceToPlain(userEntity, {
      groups: ['userChallenges'],
    }) as UserInterface;
  }

  async getUserNumOfGames(userId: string): Promise<number> {
    return await this.userChallengesRepository.countBy({
      userId: Like(userId),
    });
  }

  async getCountUserVictories(userId: string): Promise<number> {
    return await this.userChallengesRepository.countBy({
      userId: Like(userId),
      isVictory: 1,
    });
  }

  async getTopPlayers(): Promise<TopPlayersInterface[]> {
    const userChallenges = await this.userChallengesRepository
      .createQueryBuilder('userChallenges')
      .select('CONCAT(user.name, " ", user.last_name) as full_name')
      .addSelect('COUNT(userChallenges.is_victory) as num_of_victories')
      .innerJoinAndSelect('userChallenges.user', 'user')
      .where('userChallenges.is_victory = :isVictory', { isVictory: 1 })
      .groupBy('userChallenges.user_id')
      .orderBy('num_of_victories', 'DESC')
      .limit(10)
      .getRawMany();
    return userChallenges.map((userChallenge) => {
      return {
        id: userChallenge.user_id,
        full_name: userChallenge.full_name,
        num_of_victories: userChallenge.num_of_victories,
      };
    });
  }

  async getTopWord(): Promise<TopWordsInterface> {
    return await this.userChallengesRepository
      .createQueryBuilder('userChallenge')
      .select('userChallenge.word as word')
      .addSelect('COUNT(userChallenge.id) as total')
      .where('userChallenge.is_victory = :isVictory', { isVictory: 1 })
      .groupBy('userChallenge.word')
      .orderBy('COUNT(userChallenge.word)', 'DESC')
      .getRawOne();
  }
}
