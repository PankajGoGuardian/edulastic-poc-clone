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
  const { page = 1, limit = 10, search } = req.query;

  try {
    const item = new Item();
    const result = await item.getList({ page: +page, limit: +limit, search });
    res.send(result);
  } catch (e) {
    console.log('error', e);
    res.status(400).send();
  }
});

router.post('/', async (req, res) => {
  try {
    const { reference: id = '' } = req.body;
    const item = new Item();
    const itemDetails = await item.add({ id });
    res.send({
      message: 'item added',
      data: itemDetails,
    });
  } catch (e) {
    console.log('error', e);
    res.status(400).send({ message: 'invalid data' });
  }
});

export default router;
