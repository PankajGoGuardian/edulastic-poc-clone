import mongoose from 'mongoose';

const resourcesSchema = mongoose.Schema(
  {
    data: Object,
    metadata: Object
  },
  {
    strict: true
  }
);

class Resources {
  constructor() {
    this.Resources = mongoose.model('Resources', resourcesSchema);
  }

  create(resources) {
    resources.createdAt = Date.now();
    const newResources = new this.Resources(resources);
    return newResources.save();
  }

  get(limit = 25, skip = 0) {
    return this.Resources.find(
      {},
      {
        createdAt: 0,
        __v: 0
      }
    )
      .limit(limit)
      .skip(skip);
  }

  getById(id) {
    return this.Resources.findOne({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  update(id, data) {
    return this.Resources.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  delete(id) {
    return this.Resources.remove({ _id: new mongoose.Types.ObjectId(id) });
  }
}

export default Resources;
