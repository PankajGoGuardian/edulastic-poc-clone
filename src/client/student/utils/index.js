import moment from "moment";

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

export const formatTime = time => {
  return moment(normaliseTime(time)).format("MMM, DD YYYY HH:mm:ss");
};

export const formatDateAndTime = time => {
  return moment(normaliseTime(time)).format("MMM DD, YYYY hh:mm A");
};

export const setStatusBgColor = ({ selectedTheme, filter, theme, enabled }) => {
  if (!enabled) {
    return "transparent";
  }
  //TODO only applied the mockup styles to default theme.
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
  const days = Math.floor(hoursPassed/24);
  if (days >= 1) {
    return `PAST DUE (${days} DAY${days > 1 ? "S" : ""})`;
  } else if (date.valueOf() > dueDate) {
    return "PAST DUE";
  }
  return null;
}