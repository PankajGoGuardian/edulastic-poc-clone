import { groupBy as _groupBy, uniq, get } from "lodash";

export const getListOfStudents = (students, classes) => {
  let idList = [];

  let selected = students
    .filter(student => classes.includes(student.groupId))
    .filter(({ _id }) => {
      if (idList.includes(_id)) return false;

      idList.push(_id);
      return true;
    });
  return selected;
};

export const formatAssignment = assignment => {
  let students = [];
  const scoreReleasedClasses = [];
  const googleAssignmentIds = {};
  const classes = (assignment.class || []).map(item => {
    if (item.specificStudents) {
      students = [...students, ...item.students];
    }

    // ignore false, it wont be overriding anything!
    if (assignment.releaseScore) {
      scoreReleasedClasses.push(item._id);
    }
    if (item.googleId) {
      googleAssignmentIds[item._id] = item.googleId;
    }
    return item;
  });

  return {
    ...assignment,
    class: classes,
    students: uniq(students),
    scoreReleasedClasses,
    googleAssignmentIds
  };
};
