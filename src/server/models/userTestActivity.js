import mongoose from 'mongoose';

const testActivitySchema = mongoose.Schema({
  testId: String,
  createdAt: String,
  userId: String,
  updatedAt: String,
  startDate: Number,
  endDate: Number,
  status: String,
  score: Number,
  maxScore: Number,
  assignmentId: String,
  correctAnswers: Number
});

class UserTestActivity {
  constructor() {
    this.UserTestActivity = mongoose.model(
      'UserTestActivties',
      testActivitySchema,
      'UserTestActivity'
    );
  }

  create(activity) {
    const now = Date.now();
    activity.startDate = now;
    activity.createdAt = now;
    activity.updatedAt = now;
    const newActivity = new this.UserTestActivity(activity);
    return newActivity.save();
  }

  getById(id) {
    return this.UserTestActivity.findOne({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  update(id, data) {
    return this.UserTestActivity.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  getByUser(userId, filters) {
    return this.UserTestActivity.find({ userId, ...filters }, { __v: 0 });
  }

  // fetch assignment by Fields
  getByFields(fields) {
    return this.UserTestActivity.find(fields);
  }
}


export default UserTestActivity;
