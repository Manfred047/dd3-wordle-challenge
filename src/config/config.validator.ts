import * as Joi from 'joi';

const ConfigValidator = Joi.object({
  // ENVIRONMENT (development | production)
  DD3_SERVICE_ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .required(),
  // HOST AND PORT
  DD3_SERVICE_HOST: Joi.string().required(),
  DD3_SERVICE_PORT: Joi.number().required(),
  // DATABASE
  DB_TYPE: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});

export { ConfigValidator };
