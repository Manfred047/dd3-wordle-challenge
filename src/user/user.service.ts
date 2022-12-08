import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const userEntity: UserEntity = new UserEntity(createUserDto);
      return await this.userRepository.save<UserEntity>(userEntity);
    } catch (exception) {
      Logger.error(
        `Error en servicio <${UserService.name}> función <create>`,
        exception.message,
      );
      throw new InternalServerErrorException();
    }
  }
}
