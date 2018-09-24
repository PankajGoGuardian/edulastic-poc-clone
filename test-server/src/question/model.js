import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({}, { strict: false });

class Question {
  constructor(question) {
    this.Question = mongoose.model('questions', questionSchema);
  }

  getQuestions(qids) {
    return this.Question.find(
      {
        _id: { $in: qids }
      },
      { answer: 0 }
    );
  }

  getQuestion(_id) {
    return this.Question.findOne(
      {
        _id
      },
      { answer: 1, type: 1 }
    );
  }

  add(question) {
    let q = new this.Question(question);
    return q.save();
  }
}

export default Question;
