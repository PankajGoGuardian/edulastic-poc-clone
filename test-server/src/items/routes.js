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
    const { reference: id, type, list = [], stimulus = '', uiStyle, validation = {} } = req.body;
    const itemModel = new Item();
    let itemDetails = await itemModel.add({ id, type, list, stimulus, uiStyle, validation });
    const itemId = itemDetails._id;
    itemDetails = await itemModel.update(itemId, { id, type, list, stimulus, uiStyle, validation });
    itemDetails = await itemModel.get(itemId);
    res.send({
      message: 'item added',
      data: itemDetails,
    });
  } catch (e) {
    console.log('error', e);
    res.status(400).send({ message: 'invalid data' });
  }
});

router.put('/:id', async (req, res) => {
  console.log('request body:', req.body);
  try {
    const { reference: id, type, list, stimulus, uiStyle, validation } = req.body;
    const itemId = req.params.id;
    const itemModel = new Item();
    await itemModel.update(itemId, { id, type, list, stimulus, uiStyle, validation });
    const itemDetails = await itemModel.get(itemId);
    res.send({
      message: 'successfully updated',
      data: itemDetails,
    });
  } catch (e) {
    console.log('error', e);
    res.status(400).send({ message: 'invalid data' });
  }
});

export default router;
