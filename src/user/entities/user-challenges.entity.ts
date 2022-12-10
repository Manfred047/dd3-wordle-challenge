import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Helper } from '../../helpers/helper';
import { UserEntity } from './user.entity';
import { UserChallengesInterface } from '../interfaces/user-challenges.interface';
import { CurrentUserChallengesEntity } from './current-user-challenges.entity';

@Entity({ name: 'user_challenges' })
export class UserChallengesEntity
  extends BaseEntity
  implements UserChallengesInterface
{
  constructor(partial: Partial<UserChallengesEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id', type: 'varchar' })
  userId!: string;

  @Expose({ name: 'is_victory' })
  @Column({
    name: 'is_victory',
    type: 'smallint',
    width: 1,
    nullable: true,
    default: null,
  })
  isVictory?: number;

  @Expose()
  @Column({ type: 'varchar', length: 255 })
  word!: string;

  @Expose({ name: 'created_at' })
  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  createdAt?: string;

  @Expose({ name: 'updated_at' })
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  updatedAt?: string;

  // RELATIONS

  @Expose({ name: 'user' })
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userChallenges)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Expose({ name: 'current_user_challenge' })
  @OneToOne(
    () => CurrentUserChallengesEntity,
    (currentUserChallengesEntity) => currentUserChallengesEntity.userChallenge,
  )
  currentUserChallenge?: CurrentUserChallengesEntity;

  // ACTIONS

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = Helper.getTodayUTCDateTime();
  }

  @BeforeUpdate()
  setUpdatedAt(): void {
    this.updatedAt = Helper.getTodayUTCDateTime();
  }
}
