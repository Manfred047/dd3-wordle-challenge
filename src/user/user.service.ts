import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Helper } from '../helpers/helper';

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

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({
      email: Like(email),
    });
  }

  async findOneByToken(token: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({
      email: Like(token),
    });
  }

  async setUserToken(userEntity: UserEntity): Promise<UserEntity> {
    userEntity.token = Helper.nanoId();
    return this.userRepository.save(userEntity);
  }
}
