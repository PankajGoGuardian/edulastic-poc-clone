import * as moment from "moment";

const checkStartDate = (rule, value, callback) => {
  const diff = moment().diff(value, "days");
  if (diff > 0) {
    callback(rule.message);
  } else {
    callback();
  }
};

const checkEndDate = (rule, value, callback) => {
  const diff = moment().diff(value, "days");
  if (diff > 0) {
    callback(rule.message);
  } else {
    callback();
  }
};

export default {
  name: [
    { required: true, message: "Please enter a valid class name" },
    { max: 256, message: "Must less than 256 characters!" }
  ],
  startDate: [{ validator: checkStartDate, message: "Should be later than the today!" }],
  endDate: [{ validator: checkEndDate, message: "Should be later than the Start date" }],
  subject: [{ required: true, message: "Please select a subject." }],
  grade: [{ required: true, message: "Please select a Grade." }],
  institutionId: [{ required: true, message: "Please select a School." }]
};
