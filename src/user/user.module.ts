import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { WordsModule } from '../words/words.module';
import { UserChallengesEntity } from './entities/user-challenges.entity';

@Module({
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserChallengesEntity]),
    WordsModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
