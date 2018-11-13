import mongoose from 'mongoose';
import config from '../config';

const { db: dbConfig } = config;

export default () => {
  mongoose.connect(
    dbConfig.uri,
    dbConfig.options,
  );

  mongoose.connection.on('error', (err) => {
    console.log('mongodb connection errror', err);
  });

  mongoose.connection.once('open', () => {
    console.log('connection to mongodb established');
  });
};
