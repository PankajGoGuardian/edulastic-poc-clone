const appId = 'edulastic-poc';
const useMocks = process.env.APP_MOCKS;
const appModeDev = process.env.APP_MODE_DEV;
const serviceHost = process.env.SERVICE_HOST || '0.0.0.0';
const env = process.env.NODE_ENV || 'localhost';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const apiUri = process.env.API_URI || 'http://edulastic-poc.snapwiz.net/api/';
console.log('appModeDev', appModeDev); // eslint-disable-line
console.log('serviceHost', serviceHost); // eslint-disable-line
console.log('env', env); // eslint-disable-line
console.log('host', host); // eslint-disable-line
console.log('apiUri', apiUri); // eslint-disable-line

module.exports = {
  appId,
  useMocks,
  appModeDev,
  env,
  basePath: '',

  buildConfig: {
    targetDir: '.build',
    assetsDir: 'assets'
  },

  proxyAssets: {
    host: 'localhost',
    port: 9090
  },

  client: {
    apiUri
  },

  server: {
    serviceHost,
    host,
    port
  },

  db: {
    uri: process.env.DB_URI || 'mongodb://localhost/edulastic-poc',
    options: {
      useNewUrlParser: true
    }
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'flyingPinkPikachu',
    expiresIn: process.env.JWT_EXPIRY || '30d'
  },

  elasticSearch: {
    uri:
      process.env.ELASTIC_SEARCH_URI ||
      'http://localhost:9200/bp_auth_otp/_search'
  },

  s3: {
    keyId: process.env.AWS_KEY_ID,
    key: process.env.AWS_KEY
  }
};
