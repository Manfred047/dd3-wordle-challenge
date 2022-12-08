import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as _ from 'lodash';
import { Helper } from '../helpers/helper';
import { UserEntity } from '../user/entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { UserInterface } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const userEntity = await this.userService.findOneByEmail(email);
    if (_.isEmpty(userEntity)) {
      this.throwLoginException();
    }
    const isValidPassword = Helper.bcryptCompare(password, userEntity.password);
    if (!isValidPassword) {
      this.throwLoginException();
    }
    return userEntity;
  }

  async validateToken(token: string): Promise<UserEntity | undefined> {
    return this.userService.findOneByToken(token);
  }

  async login(email: string, password: string): Promise<UserInterface> {
    const userEntity = await this.validateUser(email, password);
    await this.userService.setUserToken(userEntity);
    return instanceToPlain(userEntity, { groups: ['login'] }) as UserInterface;
  }

  /**
   * Función que unifica el mensaje para login con email/password
   */
  throwLoginException(): void {
    throw new UnauthorizedException(
      'Usuario/contraseña incorrectos',
      'incorrect_user_password',
    );
  }
}
