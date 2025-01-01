import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().default('1h'),
});
