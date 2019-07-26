import { groupBy, map, find } from "lodash";

const getCourses = classData => {
  const groupedByCourse = groupBy(classData, "courseId");

  return map(groupedByCourse, (course, courseId) => ({
    title: course[0].courseName,
    key: courseId
  }));
};

const getTerms = (classData, terms) => {
  const groupedByTerm = groupBy(classData, "termId");

  return map(groupedByTerm, (term, termId) => {
    const { name = "" } = find(terms, term => term._id == termId) || {};

    return {
      title: name,
      key: termId
    };
  });
};

export const getFilterOptions = (classData = [], terms = []) => {
  const courseOptions = getCourses(classData);
  const termOptions = getTerms(classData, terms);

  return {
    courseOptions,
    termOptions
  };
};
