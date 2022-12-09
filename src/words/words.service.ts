import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { DeleteResult, Repository, Not, Like } from 'typeorm';
import { WordInterface } from './interfaces/word.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { SelectedWordEntity } from './entities/selected-word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
    @InjectRepository(SelectedWordEntity)
    private readonly selectedWordRepository: Repository<SelectedWordEntity>,
  ) {}

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

  async getNewWord(
    currentSelectedWord: string,
    wordLength = 5,
  ): Promise<WordEntity> {
    return await this.wordRepository
      .createQueryBuilder('selectedWord')
      .select()
      .where('selectedWord.word NOT LIKE :currentSelectedWord', {
        currentSelectedWord,
      })
      .andWhere('LENGTH(selectedWord.word) = :wordLength', { wordLength })
      .orderBy('RAND()')
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
  }
}
