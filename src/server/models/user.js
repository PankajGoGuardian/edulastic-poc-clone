import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    role: String,
    firstName: String,
    lastName: String
  },
  {
    strict: false
  }
);

const userDetailsFormatter = {
  __id: 1,
  firstName: 1,
  lastName: 1,
  email: 1
};

class User {
  constructor() {
    this.User = mongoose.model('User', userSchema);
  }

  // add a user to db
  create(user) {
    user.createdAt = Date.now();
    const newUser = new this.User(user);
    return newUser.save();
  }

  getByEmail(email) {
    return this.User.findOne({ email });
  }

  getByIds(userIds) {
    return this.User.find({ _id: { $in: userIds } }, userDetailsFormatter);
  }

  deleteByEmail(email) {
    return this.User.remove({ email });
  }
}

export default User;
