import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
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
import { CurrentUserChallengesEntity } from './entities/current-user-challenges.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserChallengesEntity)
    private readonly userChallengesRepository: Repository<UserChallengesEntity>,
    @InjectRepository(CurrentUserChallengesEntity)
    private readonly currentUserChallengesRepository: Repository<CurrentUserChallengesEntity>,
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

  async getOrCreateCurrentUserChallenge(
    authUser: UserEntity,
    currentSelectedWord: string,
  ) {
    let currentUserChallenge: CurrentUserChallengesEntity;
    if (!authUser.currentUserChallengeId) {
      const userEntity = await this.userRepository.findOneBy({
        id: Like(authUser.id),
      });
      const userChallenge = await this.createUserChallenge(
        userEntity.id,
        currentSelectedWord,
      );
      currentUserChallenge = new CurrentUserChallengesEntity({
        attempt: 0,
        userChallengeId: userChallenge.id,
      });
      currentUserChallenge = await this.currentUserChallengesRepository.save(
        currentUserChallenge,
      );
      userEntity.currentUserChallengeId = currentUserChallenge.id;
      await this.userRepository.save(userEntity);
      return currentUserChallenge;
    }
    currentUserChallenge = await this.currentUserChallengesRepository.findOneBy(
      {
        id: Like(authUser.currentUserChallengeId),
      },
    );
    if (!currentUserChallenge.userChallengeId) {
      const userChallenge = await this.createUserChallenge(
        authUser.id,
        currentSelectedWord,
      );
      currentUserChallenge.userChallengeId = userChallenge.id;
      currentUserChallenge = await this.currentUserChallengesRepository.save(
        currentUserChallenge,
      );
    }
    return currentUserChallenge;
  }

  async createUserChallenge(
    userId: string,
    currentSelectedWord: string,
  ): Promise<UserChallengesEntity> {
    const userChallengesEntity = new UserChallengesEntity({
      userId: userId,
      word: currentSelectedWord,
    });
    const userChallenge = await this.userChallengesRepository.save(
      userChallengesEntity,
    );
    return userChallenge;
  }

  async setUserChallengeVictory(
    userChallengeId: string,
    isVictory: number,
  ): Promise<UserChallengesEntity> {
    const userChallengeEntity = await this.userChallengesRepository.findOneBy({
      id: Like(userChallengeId),
    });
    userChallengeEntity.isVictory = isVictory;
    return await this.userChallengesRepository.save(userChallengeEntity);
  }

  async getCurrentGameResult(authUser: UserEntity, userWord: string) {
    const selectedWordEntity = await this.wordsService.getCurrentSelectedWord();
    const currentUserChallengeEntity =
      await this.getOrCreateCurrentUserChallenge(
        authUser,
        selectedWordEntity.word,
      );

    if (currentUserChallengeEntity.attempt >= 5) {
      await this.setUserChallengeVictory(
        currentUserChallengeEntity.userChallengeId,
        0,
      );
      throw new UnauthorizedException('Max attempts', 'max_attempts');
    }

    const attempt = 1;
    const wordResponse = Helper.compareUserWords(
      selectedWordEntity.word,
      userWord,
    );

    const isVictory = Helper.isVictory(wordResponse);

    if (isVictory) {
      await this.setUserChallengeVictory(
        currentUserChallengeEntity.userChallengeId,
        1,
      );
    }

    currentUserChallengeEntity.attempt =
      currentUserChallengeEntity.attempt + attempt;
    await this.currentUserChallengesRepository.save(currentUserChallengeEntity);

    return wordResponse;
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
