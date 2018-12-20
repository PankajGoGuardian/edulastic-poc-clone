import mongoose from 'mongoose';

const assignmentSchema = mongoose.Schema({
  testId: String,
  assignedBy: Object,
  startDate: String,
  endDate: String,
  createdAt: String,
  updatedAt: String,
  class: Array,
  students: Array,
  openPolicy: String,
  closePolicy: String,
  specificStudents: Boolean
});

class Assignment {
  constructor() {
    this.Assignment = mongoose.model(
      'Assignment',
      assignmentSchema,
      'Assignment'
    );
  }

  create(assignment) {
    const currentDate = Date.now();
    assignment.createdAt = currentDate;
    assignment.updatedAt = currentDate;
    const newAssignment = new this.Assignment(assignment);
    return newAssignment.save();
  }

  update(id, data) {
    data.updatedAt = Date.now();
    return this.Assignment.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id)
      },
      data,
      { new: true }
    );
  }

  /*
  * fetch assignment by id
  * @params _id {string} - mongo id of assignments
  * @params outputFields {[]string} - required fields in output
  */
  getById(_id, outputFields) {
    const projections = {};
    outputFields.forEach((field) => {
      projections[field] = 1;
    });

    return this.Assignment.findOne({
      _id
    }, projections);
  }

  delete(id) {
    return this.Assignment.remove({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  getByClassId(groupId, studentId) {
    return this.Assignment.find({
      $or: [{ class: groupId, specificStudents: false }, { students: studentId }]
    });
  }

  getByClassList(groupIds, studentId, sortOptions = {}) {
    return this.Assignment.find({
      $or: [{ class: { $in: groupIds }, specificStudents: false }, { students: studentId }]
    }).sort(sortOptions);
  }

  byTest(testId, ownerId) {
    return this.Assignment.find({
      'assignedBy.id': ownerId,
      testId
    });
  }
}

export default Assignment;
