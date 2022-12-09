import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WordInterface } from '../interfaces/word.interface';
import { Expose } from 'class-transformer';

@Entity({ name: 'selected_words' })
export class SelectedWordEntity extends BaseEntity implements WordInterface {
  constructor(partial: Partial<SelectedWordEntity>) {
    super();
    Object.assign(this, partial);
  }
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, unique: true })
  word!: string;
}
