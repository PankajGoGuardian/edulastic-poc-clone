import cors from 'cors';
import config from 'config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();
const port = process.env.PORT || 9020;

const mongoConfig = config.get('mongo');
console.log(mongoConfig.connectionUri);
mongoose.connect(mongoConfig.connectionUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// register middlewares
app.use(bodyParser.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`app started on port ${port}`);
});
