import mongoose from 'mongoose';

const shema = mongoose.Schema({}, { strict: false });

class Item {
  constructor() {
    this.Item = mongoose.model('items', shema);
  }

  get(id) {
    return this.Item.findById(id);
  }

  async getList({ page, limit, search }) {
    const filter = search ? { $text: { $search: search } } : {};
    const items = await this.Item.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.Item.count();

    return {
      items,
      count,
      page,
    };
  }

  update(_id, item) {
    return this.Item.update({ _id }, item);
  }

  add(item) {
    const it = new this.Item(item);
    return it.save();
  }
}

export default Item;
