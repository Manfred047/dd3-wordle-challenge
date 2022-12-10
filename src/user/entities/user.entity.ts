import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInterface } from '../interfaces/user.interface';
import { Exclude, Expose } from 'class-transformer';
import { Helper } from '../../helpers/helper';
import { UserChallengesEntity } from './user-challenges.entity';
import { CurrentUserChallengesEntity } from './current-user-challenges.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements UserInterface {
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose({ name: 'email' })
  @Column({ type: 'varchar', length: 50, unique: true })
  email!: string;

  @Expose({ name: 'name' })
  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Expose({ name: 'last_name' })
  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName!: string;

  @Exclude()
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  password?: string;

  @Expose({ groups: ['login'] })
  @Column({
    name: 'token',
    type: 'char',
    length: 100,
    unique: true,
    nullable: true,
    default: null,
  })
  token?: string;

  @Expose({ name: 'current_user_challenge_id' })
  @Column({
    name: 'current_user_challenge_id',
    type: 'varchar',
    unique: true,
    nullable: true,
    default: null,
  })
  currentUserChallengeId?: string;

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

  // CUSTOM FIELDS (NOT IN DATABASE)
  @Expose({ name: 'num_of_games', groups: ['userChallenges'] })
  numOfGames?: number;

  @Expose({ name: 'num_of_victories', groups: ['userChallenges'] })
  numOfVictories?: number;

  // GETTERS
  @Expose({ name: 'full_name' })
  getFullName() {
    return `${this.name} ${this.lastName}`;
  }

  // RELATIONS

  @Expose({ name: 'user_challenges' })
  @OneToMany(
    () => UserChallengesEntity,
    (userChallengesEntity) => userChallengesEntity.user,
  )
  userChallenges!: UserChallengesEntity[];

  @Expose({ name: 'current_user_challenge' })
  @OneToOne(() => CurrentUserChallengesEntity)
  @JoinColumn({ name: 'current_user_challenge_id' })
  currentUserChallenge?: CurrentUserChallengesEntity;

  // ACTIONS

  @BeforeInsert()
  setCreatedAt(): void {
    this.createdAt = Helper.getTodayUTCDateTime();
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await Helper.bcryptHash(this.password);
  }

  @BeforeUpdate()
  setUpdatedAt(): void {
    this.updatedAt = Helper.getTodayUTCDateTime();
  }
}
