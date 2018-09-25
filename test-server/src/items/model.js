import mongoose, { Mongoose } from 'mongoose';

const shema = mongoose.Schema({}, { strict: false });

class Item {
  constructor(item) {
    this.Item = mongoose.model('items', shema);
  }

  get(id) {
    return this.Item.findById(id);
  }

  update(_id, item) {
    return this.Item.update({ _id: _id }, item);
  }
}

export default Item;
