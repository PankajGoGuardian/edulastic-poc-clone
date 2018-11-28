import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    role: String,
    name: String
  },
  {
    strict: false
  }
);

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
}

export default User;
