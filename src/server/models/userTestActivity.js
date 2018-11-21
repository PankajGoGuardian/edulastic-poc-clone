import mongoose from 'mongoose';

const testActivitySchema = mongoose.Schema({
  testId: String,
  createdAt: String,
  userId: String,
  updatedAt: String,
  status: String,
  score: String,
  totalQuestion: String
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
    activity.createdAt = Date.now();
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
}

export default UserTestActivity;
