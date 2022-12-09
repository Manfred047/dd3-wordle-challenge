import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { SelectedWordEntity } from './entities/selected-word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity, SelectedWordEntity])],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
