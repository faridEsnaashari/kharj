export const appConfigs = {
  appPort: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
  appBaseUrl: process.env.APP_BASE_URL
    ? process.env.APP_BASE_URL
    : 'http://localhost:3000',
};
