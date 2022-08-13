export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    connectionUri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiresInSec: parseInt(process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC, 10),
    refreshTokenExpiresInSec: parseInt(process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC, 10),
  },
  redis: {
    host: process.env.REDIST_HOST || 'localhost',
    port: process.env.REDIST_PORT || '6379',
  },
  auth: {
    defaultAdminUser: process.env.DEFAULT_ADMIN_USER,
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
  },
});
