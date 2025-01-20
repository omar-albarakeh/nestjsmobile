import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().regex(/^\d+[smhd]$/).default('1h'),
  PORT: Joi.number().default(3001),
});