import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserIdDto {
  @ApiProperty({ name: 'user_id', required: true, format: 'UUID' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  @IsUUID()
  userId!: string;
}
