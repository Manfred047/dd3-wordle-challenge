import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInterface } from '../interfaces/user.interface';
import { Exclude, Expose } from 'class-transformer';
import { Helper } from '../../helpers/helper';

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
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  password?: string;

  @Exclude()
  @Column({
    type: 'char',
    length: 100,
    unique: true,
    nullable: true,
    default: null,
  })
  token?: string;

  @Expose({ name: 'created_at' })
  @Column({
    name: 'created_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  createdAt?: string;

  @Expose({ name: 'updated_at' })
  @Column({
    name: 'updated_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  updatedAt?: string;

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
