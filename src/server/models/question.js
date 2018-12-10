import mongoose from 'mongoose';

const questionSchema = mongoose.Schema(
  {
    data: Object,
    metadata: Object,
    alignment: Array
  },
  {
    strict: true
  }
);

const formatOutput = {
  createdAt: 0,
  __v: 0
};

class Question {
  constructor() {
    this.Question = mongoose.model('Question', questionSchema, 'Question');
  }

  create(question) {
    question.createdAt = Date.now();
    const newQuestion = new this.Question(question);
    return newQuestion.save();
  }

  get(limit = 25, skip = 0) {
    return this.Question.find({}, formatOutput)
      .limit(limit)
      .skip(skip);
  }

  getById(id) {
    return this.Question.findOne({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  update(id, data) {
    return this.Question.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  delete(id) {
    return this.Question.remove({ _id: new mongoose.Types.ObjectId(id) });
  }

  // get all questions from array of Ids
  selectQuestionsByIds(ids) {
    return this.Question.find(
      {
        _id: { $in: ids }
      },
      formatOutput
    );
  }
}

export default Question;
