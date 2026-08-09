export const databaseConfig = {
  development: {
    host: process.env.STAGE_MYSQL_HOST || 'localhost',
    port: process.env.STAGE_MYSQL_PORT ? +process.env.STAGE_MYSQL_PORT : 3306,
    username: process.env.STAGE_MYSQL_USERNAME || 'root',
    password: process.env.STAGE_MYSQL_PASSWORD || 'pass',
    database: process.env.STAGE_MYSQL_DATABASE || 'test',
    timezone: process.env.DB_TIMEZONE || '+03:30',
    dialectOptions: {
      typeCast: process.env.DB_TYPE_CAST !== 'false',
      dateStrings: process.env.DB_DATE_STRINGS !== 'false',
    },
    logging: process.env.DB_LOGGING !== 'false',
  },
  test: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'pass',
    database: process.env.MYSQL_DATABASE || 'test',
    timezone: process.env.DB_TIMEZONE || '+03:30',
    dialectOptions: {
      typeCast: process.env.DB_TYPE_CAST !== 'false',
      dateStrings: process.env.DB_DATE_STRINGS !== 'false',
    },
    logging: process.env.DB_LOGGING !== 'false',
  },
  production: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3306,
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'pass',
    database: process.env.MYSQL_DATABASE || 'test',
    timezone: process.env.DB_TIMEZONE || '+03:30',
    dialectOptions: {
      typeCast: process.env.DB_TYPE_CAST !== 'false',
      dateStrings: process.env.DB_DATE_STRINGS !== 'false',
    },
    logging: process.env.DB_LOGGING !== 'false',
  },
};
