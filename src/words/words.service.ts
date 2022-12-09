import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { DeleteResult, Repository, Like, UpdateResult } from 'typeorm';
import { WordInterface } from './interfaces/word.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { SelectedWordEntity } from './entities/selected-word.entity';
import { CurrentUserChallengesEntity } from '../user/entities/current-user-challenges.entity';
import { UserChallengesEntity } from '../user/entities/user-challenges.entity';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfigInterface } from '../config/interfaces/database.config.interface';

@Injectable()
export class WordsService {
  private readonly databaseConfig: DatabaseConfigInterface;
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
    @InjectRepository(SelectedWordEntity)
    private readonly selectedWordRepository: Repository<SelectedWordEntity>,
    @InjectRepository(CurrentUserChallengesEntity)
    private readonly currentUserChallengesRepository: Repository<CurrentUserChallengesEntity>,
    @InjectRepository(UserChallengesEntity)
    private readonly userChallengesRepository: Repository<UserChallengesEntity>,
    private readonly configService: ConfigService,
  ) {
    this.databaseConfig =
      this.configService.get<DatabaseConfigInterface>('database');
  }

  /**
   * Lee la información del diccionario y la prepara para su inserción en base de datos
   */
  parseWordFile(): WordInterface[] {
    const arrayWords = fs
      .readFileSync(path.resolve(__dirname, 'files/words.txt'), 'utf8')
      .toString()
      .split('\n');
    const parseWords: WordInterface[] = [];
    for (const wordIdx in arrayWords) {
      parseWords.push({
        word: arrayWords[wordIdx],
      });
    }
    return parseWords;
  }

  async saveWordDictionary(): Promise<void> {
    const words = this.parseWordFile();
    const wordChunks = _.chunk(words, 20);
    const chunkSize = _.size(wordChunks);
    for (let i = 0; i < chunkSize; i++) {
      const wordDictToSave = wordChunks[i];
      const insertResult = await this.wordRepository
        .createQueryBuilder()
        .insert()
        .orIgnore()
        .values(wordDictToSave)
        .execute();
    }
  }

  async getCurrentSelectedWord(): Promise<SelectedWordEntity> {
    const words = await this.selectedWordRepository.find();
    return _.first(words);
  }

  async deleteSelectedWords(): Promise<DeleteResult> {
    return await this.selectedWordRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }

  async saveSelectedWord(currentSelectedWord: string) {
    const selectedWordEntity = new SelectedWordEntity({
      word: currentSelectedWord,
    });
    return await this.selectedWordRepository.save(selectedWordEntity);
  }

  async getCurrentUserChallenges(): Promise<CurrentUserChallengesEntity[]> {
    return await this.currentUserChallengesRepository.find();
  }

  async resetCurrentUserChallenges(): Promise<UpdateResult> {
    return await this.currentUserChallengesRepository
      .createQueryBuilder('currentUserChallenge')
      .update()
      .set({ userChallengeId: null, attempt: 0, user_word: null })
      .execute();
  }

  async setUserChallengeByReset(
    userChallengeId: string,
  ): Promise<UserChallengesEntity> {
    const userChallengeEntity = await this.getUserChallengeById(
      userChallengeId,
    );
    userChallengeEntity.isVictory = 0;
    return await this.userChallengesRepository.save(userChallengeEntity);
  }

  async getUserChallengeById(
    userChallengeId: string,
  ): Promise<UserChallengesEntity | null> {
    return await this.userChallengesRepository.findOneBy({
      id: Like(userChallengeId),
    });
  }

  async getNewWord(
    currentSelectedWord: string,
    wordLength = 5,
  ): Promise<WordEntity> {
    const randString =
      this.databaseConfig.type === 'postgres' ? 'RANDOM()' : 'RAND()';
    return await this.wordRepository
      .createQueryBuilder('selectedWord')
      .select()
      .where('selectedWord.word NOT LIKE :currentSelectedWord', {
        currentSelectedWord,
      })
      .andWhere('LENGTH(selectedWord.word) = :wordLength', { wordLength })
      .orderBy(randString)
      .limit(1)
      .getOne();
  }

  async regenerateSelectedWord() {
    const currentSelectedWord =
      (await this.getCurrentSelectedWord()) ||
      new SelectedWordEntity({ word: '' });
    const wordEntity = await this.getNewWord(currentSelectedWord.word);
    await this.deleteSelectedWords();
    await this.saveSelectedWord(wordEntity.word);
    const currentUserChallenges = await this.getCurrentUserChallenges();
    await this.resetCurrentUserChallenges();
    const currentUserChallengesSize = _.size(currentUserChallenges);
    for (let i = 0; i < currentUserChallengesSize; i++) {
      const userChallengeId = currentUserChallenges[i].userChallengeId;
      await this.setUserChallengeByReset(userChallengeId);
    }
  }
}
