import mongoose from 'mongoose';

const testItemActivitySchema = mongoose.Schema({
  userId: String,
  answers: Object,
  testItemId: String,
  createdAt: String,
  updatedAt: String,
  testActivityId: String,
  score: Number,
  maxScore: Number,
  correct: Number,
  wrong: Number,
  evaluations: Object
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

  /*
  * add a new entry if not present, else update user response
  * @params testItemActivity {Obj} - userTestItemAcitivty object
  */
  add({ testItemId, testActivityId, answers, ...fields }) {
    return this.UserTestItemActivity.findOneAndUpdate(
      {
        testItemId,
        testActivityId
      },
      {
        testItemId,
        testActivityId,
        answers,
        ...fields,
        updatedAt: Date.now()
      },
      {
        upsert: true,
        new: true
      }
    );
  }
}

export default UserTestItemActivity;
