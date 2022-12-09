import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { SelectedWordEntity } from './entities/selected-word.entity';
import { CurrentUserChallengesEntity } from '../user/entities/current-user-challenges.entity';
import { UserChallengesEntity } from '../user/entities/user-challenges.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WordEntity,
      SelectedWordEntity,
      CurrentUserChallengesEntity,
      UserChallengesEntity,
    ]),
  ],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
