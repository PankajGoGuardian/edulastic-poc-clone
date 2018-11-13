const appId = 'edulastic-poc';
const useMocks = process.env.APP_MOCKS === '1';
const appModeDev = process.env.APP_MODE_DEV === '1';
const serviceHost = process.env.SERVICE_HOST || '0.0.0.0';
const env = process.env.NODE_ENV || 'localhost';
const host = process.env.HOST || '0.0.0.0';
console.log('appModeDev', appModeDev); // eslint-disable-line
console.log('serviceHost', serviceHost); // eslint-disable-line
console.log('env', env); // eslint-disable-line
console.log('host', host); // eslint-disable-line

const config = {
  appId,
  useMocks,
  appModeDev,
  env,
  basePath: '',

  buildConfig: {
    targetDir: '.build',
    assetsDir: 'assets',
  },

  proxyAssets: {
    host: 'localhost',
    port: 9090,
  },

  server: {
    serviceHost,
    host,
    port: 3000,
  },

  db: {
    uri: process.env.DB_URI || 'mongodb://localhost/edulastic-poc',
    options: {},
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'flyingPinkPikachu',
    expiresIn: process.env.JWT_EXPIRY || '30d',
  },
};

export default config;
