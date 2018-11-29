import mongoose from 'mongoose';

const groupSchema = mongoose.Schema(
  {
    type: String,
    name: String,
    parent: {
      id: String,
      type: String
    },
    owners: Array
  },
  {
    strict: false
  }
);

const formatOutput = {
  __v: 0
};

class Group {
  constructor() {
    this.Group = mongoose.model('Group', groupSchema, 'Group');
  }

  create(group) {
    group.createdAt = Date.now();
    group.upatedAt = Date.now();
    const newGroup = new this.Group(group);
    return newGroup.save();
  }

  update(id, data) {
    return this.Group.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  getByOwnerId(ownerId, { limit, skip } = { limit: 10, skip: 0 }) {
    return this.Group.find(
      {
        'owners.id': ownerId
      },
      formatOutput
    )
      .limit(limit)
      .skip(skip);
  }

  delete(id) {
    return this.Test.remove({
      _id: new mongoose.Types.ObjectId(id)
    });
  }
}

export default Group;
