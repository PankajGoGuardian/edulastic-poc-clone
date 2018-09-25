import mongoose from 'mongoose';

const shema = mongoose.Schema({}, { strict: false });

class Item {
  constructor() {
    this.Item = mongoose.model('items', shema);
  }

  get(id) {
    return this.Item.findById(id);
  }

  getAll() {
    return this.Item.find({});
  }
}

export default Item;
