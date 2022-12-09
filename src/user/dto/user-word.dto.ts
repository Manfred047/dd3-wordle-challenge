import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserWordDto {
  @ApiProperty({ name: 'user_word', required: true, minimum: 5, maximum: 5 })
  @Expose({ name: 'user_word' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  @MinLength(5)
  userWord!: string;
}
