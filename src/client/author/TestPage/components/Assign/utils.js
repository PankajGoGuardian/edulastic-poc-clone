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

export const generateClassData = (
  classes = [],
  selectedStudents = [],
  studentList = [],
  specificStudents,
  groupsData
) => {
  if (!specificStudents) {
    return classes.map(_id => ({
      _id,
      name: get(groupsData, `${_id}.name`, ""),
      assignedCount: get(groupsData, `${_id}.studentCount`, 0),
      grade: get(groupsData, `${_id}.grade`, ""),
      subject: get(groupsData, `${_id}.subject`, ""),
      termId: get(groupsData, `${_id}.termId`, "")
    }));
  }

  selectedStudents = studentList.filter(({ _id }) => selectedStudents.includes(_id));

  const groupedByClass = _groupBy(selectedStudents, "groupId");

  return (
    classes
      .map(classId => {
        const tempStudents = uniq((groupedByClass[classId] || []).map(item => item._id));
        return {
          _id: classId,
          name: groupsData[classId].name,
          students: tempStudents,
          assignedCount: tempStudents.length,
          grade: groupsData[classId].grade,
          subject: groupsData[classId].subject,
          termId: groupsData[classId].termId
        };
      })
      // remove classes without students
      .filter(item => item.students && item.students.length)
  );
};

export const formatAssignment = assignment => {
  let students = [];
  const scoreReleasedClasses = [];
  const googleAssignmentIds = {};
  const classes = (assignment.class || []).map(item => {
    if (assignment.specificStudents) {
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
