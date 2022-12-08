import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true, minimum: 2, maximum: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  name!: string;

  @ApiProperty({ name: 'last_name', required: true, minimum: 2, maximum: 50 })
  @Expose({ name: 'last_name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  lastName!: string;

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
