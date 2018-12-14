import mongoose from 'mongoose';

// formatter
const getByClassFormatter = {
  __v: 0
};

const enrollmentSchema = mongoose.Schema({
  type: String,
  groupId: String,
  userId: String,
  startDate: String,
  endDate: String,
  status: String
});

class Enrollment {
  constructor() {
    this.Enrollment = mongoose.model(
      'Enrollment',
      enrollmentSchema,
      'Enrollment'
    );
  }

  // create an enrollment
  create(enrollment) {
    const currentDate = Date.now();
    enrollment.createdAt = currentDate;
    enrollment.updatedAt = currentDate;

    const newEnrollment = new this.Enrollment(enrollment);
    return newEnrollment.save();
  }

  update(id, data) {
    data.updatedAt = Date.now();
    return this.Enrollment.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  getStudentsByClass(classId) {
    return this.Enrollment.find(
      {
        type: 'class',
        groupId: classId
      },
      getByClassFormatter
    );
  }

  getClassOfStudent(userId) {
    return this.Enrollment.findOne(
      {
        userId
      },
      { groupId: 1 }
    );
  }

  getClassListByStudent(userId) {
    return this.Enrollment.find(
      {
        userId,
        type: 'class'
      },
      { groupId: 1 }
    );
  }
}

export default Enrollment;
