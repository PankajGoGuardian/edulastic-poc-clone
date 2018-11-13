import express from 'express';
import path from 'path';
import proxy from 'http-proxy-middleware';
import config from './config/default';
import router from './router';

const app = express();
const { buildConfig: { assetsDir, targetDir }, server: { port }, proxyAssets } = config;

if (config.appModeDev) {
  app.use(
    `/${assetsDir}`,
    proxy({ target: `http://${proxyAssets.host}:${proxyAssets.port}`, changeOrigin: true }),
  );
} else {
  app.use(
    `/${assetsDir}`,
    express.static(path.join(process.cwd(), targetDir, 'client')),
  );
}

app.use('*', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
