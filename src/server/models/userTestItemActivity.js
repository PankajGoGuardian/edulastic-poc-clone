import mongoose from 'mongoose';

const testItemActivitySchema = mongoose.Schema({
  userId: String,
  answers: Object,
  testItemId: String,
  createdAt: String,
  updatedAt: String,
  testActivityId: String
});

class UserTestItemActivity {
  constructor() {
    this.UserTestItemActivity = mongoose.model(
      'UserTestItemActivity',
      testItemActivitySchema,
      'UserTestItemActivity'
    );
  }

  create(activity) {
    activity.createdAt = Date.now();
    activity.updatedAt = Date.now();

    const newActivity = this.UserTestItemActivity(activity);
    return newActivity.save();
  }

  getByTestActivityId(testActivityId, userId) {
    return this.UserTestItemActivity.find(
      {
        userId,
        testActivityId
      },
      { answers: 1 }
    );
  }
}

export default UserTestItemActivity;
