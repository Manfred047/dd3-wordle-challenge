import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    req.$user = await this.verifyAuth(req);
    return next();
  }

  getBearerTokenFromHeader(req: any): string {
    const token = _.get(req, ['headers', 'authorization'], '');
    return _.get(token.split(' '), [1], '');
  }

  async verifyAuth(req: any): Promise<UserEntity> {
    const token = this.getBearerTokenFromHeader(req);
    const userEntity = await this.authService.validateToken(token);
    if (_.isEmpty(userEntity)) {
      throw new UnauthorizedException('Unauthenticated', 'unauthenticated');
    }
    return userEntity;
  }
}
