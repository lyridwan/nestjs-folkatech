import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from '@hapi/joi';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: `.env`,
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string().valid('development', 'production', 'staging').default('development'),
    APP_PORT: Joi.number().required(),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXP_IN_SEC: Joi.number().required(),
    JWT_REFRESH_TOKEN_EXP_IN_SEC: Joi.number().required(),
    DEFAULT_ADMIN_USER: Joi.string().required(),
    DEFAULT_ADMIN_PASSWORD: Joi.string().required(),
  }),
};
