import { uniqBy } from "lodash";

export const getListOfStudents = (students, classes) =>
  uniqBy(students.filter(student => classes.includes(student.groupId)), "_id");
