import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import boom from 'express-boom';
import handlebars from 'handlebars';
import bodyParser from 'body-parser';
import pino from 'express-pino-logger';
import proxy from 'http-proxy-middleware';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import router from './routes';
import swaggerSpec from './services/swagger';
import authMiddleware from './middelwares/authMiddleware';
import initDbConnection from './services/mongodb';

const app = express();
const {
  buildConfig: { assetsDir, targetDir },
  server: { port },
  proxyAssets
} = config;

/** ***********************
 *      middlewares      *
 ************************ */

app.use(boom());
app.use(cors());
app.use(pino());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/** ************************
 *        routes          *
 ************************* */

if (config.appModeDev) {
  app.use(
    `/${assetsDir}`,
    proxy({
      target: `http://${proxyAssets.host}:${proxyAssets.port}`,
      changeOrigin: true
    })
  );
} else {
  app.use(
    `/${assetsDir}`,
    express.static(path.join(process.cwd(), targetDir, 'client'))
  );
}

app.use('/api', [authMiddleware], router);
app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerSpec);

app.use('*', (req, res) => {
  const template = handlebars.compile(
    fs.readFileSync(path.join(__dirname, 'index.hbs'), 'utf8')
  );
  const context = {
    title: 'Edulastic Poc App'
  };
  res.send(template(context));
});

// app initialization
initDbConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
