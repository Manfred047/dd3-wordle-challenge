import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';

const Helper = {
  defaultDateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
  validationPipe() {
    return new ValidationPipe({
      exceptionFactory: (errors) => {
        const validationErrors = {
          error: 'validation_error',
          errors: {},
          message: 'The given data was invalid',
        };
        errors.forEach((error) => {
          if (!_.isEmpty(_.get(error, ['children']))) {
            error.children.forEach((child) => {
              child.children.forEach((c) => {
                const path = `${error.property}.${child.property}.${c.property}`;
                validationErrors.errors[path] = Object.values(c.constraints);
              });
            });
          } else {
            validationErrors.errors[error.property] = Object.values(
              error.constraints,
            );
          }
        });
        return new UnprocessableEntityException(validationErrors);
      },
      transform: true,
      whitelist: true,
    });
  },
  /**
   * Obtiene la fecha y hora actual en UTC
   */
  getTodayUTCDateTime(): string {
    return DateTime.now().toUTC().toFormat(this.defaultDateTimeFormat);
  },
  /**
   * Genera un hash para contraseña de forma asincrona
   * Uso recomendado en back-end
   *
   * @param password
   * @param saltRounds
   */
  async bcryptHash(password: any, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  },
  /**
   * Determina si la contraseña es correcta de forma asincrona
   *
   * @param password
   * @param hash
   */
  async bcryptCompare(password: any, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};

export { Helper };
