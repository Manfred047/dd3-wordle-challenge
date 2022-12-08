import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, maximum: 50, format: 'email' })
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email!: string;

  @ApiProperty({ required: true, minimum: 8, maximum: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  password!: string;
}
