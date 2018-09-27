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
}

export default Item;
