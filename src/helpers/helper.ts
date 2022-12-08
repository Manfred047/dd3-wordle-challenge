import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import * as _ from 'lodash';

const Helper = {
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
};

export { Helper };
