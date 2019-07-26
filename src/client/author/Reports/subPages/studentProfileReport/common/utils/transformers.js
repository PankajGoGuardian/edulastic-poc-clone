import { groupBy, map, find } from "lodash";

const getCourses = classData => {
  const groupedByCourse = groupBy(classData, "courseId");

  return map(groupedByCourse, (course, courseId) => ({
    title: course[0].courseName,
    key: courseId
  }));
};

const getTerms = (terms = []) =>
  map(terms, term => {
    return {
      title: term.name,
      key: term._id
    };
  });

export const getFilterOptions = (classData = [], terms = []) => {
  const courseOptions = getCourses(classData);
  const termOptions = getTerms(terms);

  return {
    courseOptions,
    termOptions
  };
};
