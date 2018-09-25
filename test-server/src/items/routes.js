import { Router } from 'express';
import Item from './model';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const item = new Item();
    const result = await item.get(req.params.id);
    if (!result) throw new Error('invalid item id');
    res.send(result);
  } catch (e) {
    console.log('error', e);
    res.status(400).send();
  }
});

router.get('/', async (req, res) => {
  try {
    const item = new Item();
    const result = await item.getAll();
    res.send(result);
  } catch (e) {
    console.log('error', e);
    res.status(400).send();
  }
});

export default router;
