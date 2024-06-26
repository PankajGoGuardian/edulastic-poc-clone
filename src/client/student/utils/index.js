import moment from "moment";
import { maxBy, orderBy } from "lodash";

export const normaliseTime = time => {
  let copiedTime = time;
  if (typeof copiedTime === "string") {
    if (isNaN(Number(copiedTime))) {
      copiedTime = new Date(copiedTime);
    } else {
      copiedTime = Number(copiedTime);
    }
  }

  return copiedTime;
};

export const formatTime = time => moment(normaliseTime(time)).format("MMM, DD YYYY HH:mm:ss");

export const formatDateAndTime = time => moment(normaliseTime(time)).format("MMM DD, YYYY hh:mm A");

export const setStatusBgColor = ({ selectedTheme, filter, theme, enabled }) => {
  if (!enabled) {
    return "transparent";
  }
  // TODO only applied the mockup styles to default theme.
  if (selectedTheme === "default") {
    return theme.headerFilters.headerSelectedFilterBgColor[filter];
  }
  return theme.headerFilters.headerSelectedFilterBgColor;
};

export const formatStudentPastDueTag = data => {
  const { dueDate, status, endDate } = data;
  let date = moment();
  if (status === "submitted") {
    date = moment(endDate);
  }
  const hoursPassed = date.diff(moment(dueDate), "hours");
  const days = Math.floor(hoursPassed / 24);
  if (days >= 1) {
    return `PAST DUE (${days} DAY${days > 1 ? "S" : ""})`;
  } if (date.valueOf() > dueDate) {
    return "PAST DUE";
  }
  return null;
};

export const maxDueDateFromClassess = (classess, studentId) => {
  // to find all classes have specific student and get max dueDate
  const studentSpecificClasses = classess.filter(
    _class => !_class.students.length || _class.students.includes(studentId)
  );

  // filter all class redirected
  const redirectedClasses = studentSpecificClasses.filter(_class => _class.redirect);
  let maxCurrentClass = {};

  if (redirectedClasses.length) {
    // if redirect class present, then take latest by redirect date
    maxCurrentClass = orderBy(redirectedClasses, ["redirectedDate"], ["desc"])[0];
  } else {
    maxCurrentClass = (studentSpecificClasses?.length && maxBy(studentSpecificClasses, "dueDate")) || {};
  }

  return maxCurrentClass.dueDate;
};

export const getServerTs = assignment => {
  if (assignment && assignment.ts) {
    return assignment.ts;
  }
  return Date.now();
};
