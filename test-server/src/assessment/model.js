import mongoose, { Mongoose } from 'mongoose';

const assessmentSchema = mongoose.Schema({}, { strict: false });

class Assessment {
  constructor(assessment) {
    this.Assessment = mongoose.model('assessments', assessmentSchema);
  }

  get(_id) {
    return this.Assessment.findOne({ _id });
  }

  update(_id, assessment) {
    return this.Assessment.update({ _id: _id }, assessment);
  }
}

export default Assessment;
