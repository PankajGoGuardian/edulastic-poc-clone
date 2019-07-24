import { groupBy, map } from "lodash";

const getCourses = classData => {
  const groupedByCourse = groupBy(classData, "courseId");

  return map(groupedByCourse, (course, courseId) => ({
    title: course[0].courseName,
    key: courseId
  }));
};

const getTerms = classData => {
  const groupedByTerm = groupBy(classData, "termId");

  return map(groupedByTerm, (term, termId) => ({
    title: termId,
    key: termId
  }));
};

export const getFilterOptions = (classData = []) => {
  const courseOptions = getCourses(classData);
  const termOptions = getTerms(classData);

  return {
    courseOptions,
    termOptions
  };
};
