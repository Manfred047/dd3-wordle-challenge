import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { WordGameResultInterface } from '../words/interfaces/word-game-result.interface';

const Helper = {
  defaultDateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
  validationPipe() {
    return new ValidationPipe({
      exceptionFactory: (errors) => {
        const validationErrors = {
          error: 'validation_error',
          errors: {},
          message: 'The given data was invalid',
        };
        errors.forEach((error) => {
          if (!_.isEmpty(_.get(error, ['children']))) {
            error.children.forEach((child) => {
              child.children.forEach((c) => {
                const path = `${error.property}.${child.property}.${c.property}`;
                validationErrors.errors[path] = Object.values(c.constraints);
              });
            });
          } else {
            validationErrors.errors[error.property] = Object.values(
              error.constraints,
            );
          }
        });
        return new UnprocessableEntityException(validationErrors);
      },
      transform: true,
      whitelist: true,
    });
  },
  /**
   * Obtiene la fecha y hora actual en UTC
   */
  getTodayUTCDateTime(): string {
    return DateTime.now().toUTC().toFormat(this.defaultDateTimeFormat);
  },
  /**
   * Genera un hash para contraseña de forma asincrona
   * Uso recomendado en back-end
   *
   * @param password
   * @param saltRounds
   */
  async bcryptHash(password: any, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  },
  /**
   * Determina si la contraseña es correcta de forma asincrona
   *
   * @param password
   * @param hash
   */
  async bcryptCompare(password: any, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
  nanoId(size = 100): string {
    return nanoid(size);
  },
  normalize(word: string, lowerCase = true): string {
    const normalize = word.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (lowerCase) {
      return normalize.toLowerCase();
    }
    return normalize;
  },
  compareUserWords(
    currentSelectedWord: string,
    userWord: string,
  ): WordGameResultInterface[] {
    const normalizeCurrentSelectedWord = this.normalize(currentSelectedWord);
    const normalizeUserWord = this.normalize(userWord);
    const wordResponse: WordGameResultInterface[] = [];
    if (_.eq(normalizeCurrentSelectedWord, normalizeUserWord)) {
      _.forEach(normalizeUserWord, (character: string) => {
        wordResponse.push({
          letter: character,
          value: 1,
        });
      });
      return wordResponse;
    }
    _.forEach(normalizeUserWord, (character: string, key: number) => {
      let value = 3;
      const hasCharacter = _.find(
        normalizeCurrentSelectedWord,
        (letter: string) => {
          return _.eq(letter, character);
        },
      );
      const sameSite = _.eq(
        _.nth(normalizeCurrentSelectedWord, key),
        character,
      );
      if (hasCharacter) {
        value = sameSite ? 1 : 2;
      }
      wordResponse.push({
        letter: character,
        value,
      });
    });
    return wordResponse;
  },
  isVictory(wordGameResult: WordGameResultInterface[]): boolean {
    let isVictory = true;
    _.forEach(wordGameResult, (result: WordGameResultInterface) => {
      if (result.value !== 1) {
        isVictory = false;
      }
    });
    return isVictory;
  },
};

export { Helper };
