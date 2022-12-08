import { Module } from '@nestjs/common';
import { WordsService } from './words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WordEntity])],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {}
