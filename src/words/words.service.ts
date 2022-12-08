import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { Repository } from 'typeorm';
import { WordInterface } from './interfaces/word.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
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
}
