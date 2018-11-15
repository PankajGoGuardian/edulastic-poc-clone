import mongoose from 'mongoose';

const testItemSchema = mongoose.Schema(
  {
    rows: Array,
    columns: Array,
    tags: Object,
    metadata: Object
  },
  {
    strict: true
  }
);

class TestItem {
  constructor() {
    this.TestItem = mongoose.model('TestItem', testItemSchema);
  }

  create(item) {
    item.createdAt = Date.now();
    const newItem = new this.TestItem(item);
    return newItem.save();
  }

  get(limit = 25, skip = 0) {
    return this.TestItem.find(
      {},
      {
        createdAt: 0,
        __v: 0
      }
    )
      .limit(limit)
      .skip(skip);
  }

  update(id, data) {
    return this.TestItem.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  getById(id) {
    return this.TestItem.findOne({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  delete(id) {
    return this.TestItem.remove({
      _id: new mongoose.Types.ObjectId(id)
    });
  }
}

export default TestItem;
