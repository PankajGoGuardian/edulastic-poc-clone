export const getListOfStudents = (students, classes) => {
  const idList = [];

  const selected = students
    .filter(student => classes.includes(student.groupId))
    .filter(({ _id }) => {
      if (idList.includes(_id)) return false;

      idList.push(_id);
      return true;
    });
  return selected;
};
