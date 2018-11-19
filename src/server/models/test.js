import mongoose from 'mongoose';

const testSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    renderingType: String,
    createdBy: Object,
    status: String,
    tags: Array,
    thumbnail: String,
    scoring: Object,
    testItems: Array,
    assignments: Array,
    standardsTag: Object,
    grades: Array,
    subjects: Array,
    courses: Array,
    collections: Array,
    analytics: Array
  },
  {
    strict: true
  }
);

const formatOutput = {
  __v: 0
};

class Test {
  constructor() {
    this.Test = mongoose.model('Tests', testSchema, 'Test');
  }

  create(test) {
    test.createdDate = Date.now();
    const newTest = new this.Test(test);
    return newTest.save();
  }

  update(id, data) {
    return this.Test.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  get(limit = 25, skip = 0) {
    return this.Test.find({}, formatOutput)
      .limit(limit)
      .skip(skip);
  }

  getById(id) {
    return this.Test.findOne(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      formatOutput
    );
  }

  delete(id) {
    return this.Test.remove({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  getCount() {
    return this.Test.count();
  }
}

export default Test;
