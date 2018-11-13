import express from 'express';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  const template = handlebars.compile(fs.readFileSync(
    path.join(__dirname, 'index.hbs'),
    'utf8',
  ));
  const context = {
    title: 'Edulastic Poc App',
  };
  res.send(template(context));
});

export default router;
