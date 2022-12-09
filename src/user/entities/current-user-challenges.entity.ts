import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { UserEntity } from './user.entity';
import { CurrentUserChallengesInterface } from '../interfaces/current-user-challenges.interface';
import { UserChallengesEntity } from './user-challenges.entity';

@Entity({ name: 'current_user_challenges' })
export class CurrentUserChallengesEntity
  extends BaseEntity
  implements CurrentUserChallengesInterface
{
  constructor(partial: Partial<CurrentUserChallengesEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose({ name: 'user_word' })
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  user_word?: string;

  @Expose({ name: 'user_challenge_id' })
  @Column({
    name: 'user_challenge_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  userChallengeId?: string;

  @Expose({ name: 'attempt' })
  @Column({ type: 'tinyint', width: 1, default: 0 })
  attempt: number;

  // RELATIONS

  @Expose({ name: 'user' })
  @OneToOne(() => UserEntity, (userEntity) => userEntity.currentUserChallenge)
  user?: UserEntity;

  @Expose({ name: 'user_challenge' })
  @OneToOne(() => UserChallengesEntity)
  @JoinColumn({ name: 'user_challenge_id' })
  userChallenge?: UserChallengesEntity;
}
