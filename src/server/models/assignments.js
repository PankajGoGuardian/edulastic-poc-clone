import mongoose from 'mongoose';

const assignmentSchema = mongoose.Schema({
  testId: String,
  assignedBy: Object,
  startDate: String,
  endDate: String,
  createdAt: String,
  updatedAt: String,
  class: Object
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

  delete(id) {
    return this.Assingment.remove({
      _id: new mongoose.Types.ObjectId(id)
    });
  }

  getByClassId(id) {
    return this.Assignment.find({
      'class.id': id
    });
  }

  byTest(testId, ownerId) {
    return this.Assignment.find({
      'assignedBy.userId': ownerId,
      testId
    });
  }
}

export default Assignment;
