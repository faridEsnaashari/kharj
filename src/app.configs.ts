export const appConfigs = {
  appPort: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
  appBaseUrl: process.env.APP_BASE_URL
    ? process.env.APP_BASE_URL
    : 'http://localhost:3000',

  nodeEnv: process.env.NODE_ENV ? process.env.NODE_ENV : 'develop',

  test: {
    appPort: process.env.TEST_APP_PORT ? +process.env.TEST_APP_PORT : 3000,
    appBaseUrl: process.env.TEST_APP_BASE_URL
      ? process.env.TEST_APP_BASE_URL
      : 'http://localhost:3000',
  },
};
