import mongoose from 'mongoose';

const curriculumSchema = mongoose.Schema(
  {
    curriculum: String,
    asnIdentifier: String,
    subject: String,
    grades: Array
  },
  {
    strict: true
  }
);

const formatOutput = {
  __v: 0
};

class Curriculum {
  constructor() {
    this.Curriculum = mongoose.model('Curriculum', curriculumSchema, 'curriculums');
  }

  create(curriculum) {
    curriculum.createdDate = Date.now();
    const newCurriculum = new this.Curriculum(curriculum);
    return newCurriculum.save();
  }

  update(id, data) {
    return this.Curriculum.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  get(limit = 25, skip = 0) {
    return this.Curriculum.find({}, formatOutput)
      .limit(limit)
      .skip(skip);
  }

  getById(id) {
    return this.Curriculum.findOne(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      formatOutput
    );
  }

  delete(id) {
    return this.Curriculum.remove({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  getCount() {
    return this.Curriculum.count();
  }

  getByIds(ids) {
    return this.Curriculum.find({ _id: { $in: ids } });
  }
}

export default Curriculum;
