import { maxBy } from "lodash";

// this is to format assignment, to included different state like, resume/absent/startDate/endDate etc
export const formatAssignment = assignment => {
  let {
    reports = [],
    endDate,
    startDate,
    open = false,
    close = false,
    isPaused = false,
    class: clazz = [],
    maxAttempts = 1,
    classId
  } = assignment;
  const currentClassList = clazz.filter(cl => cl._id === classId);

  if (!startDate || !endDate) {
    const maxCurrentClass =
      currentClassList && currentClassList.length > 0
        ? maxBy(currentClassList, "endDate") || currentClassList[currentClassList.length - 1]
        : {};
    open = maxCurrentClass.open;
    close = maxCurrentClass.close;
    startDate = maxCurrentClass.startDate;
    endDate = maxCurrentClass.endDate;
    isPaused = maxCurrentClass.isPaused;
  }
  if (!startDate && open) {
    const maxCurrentClass =
      currentClassList && currentClassList.length > 0
        ? maxBy(currentClassList, "openDate") || currentClassList[currentClassList.length - 1]
        : {};
    startDate = maxCurrentClass.openDate;
    isPaused = maxCurrentClass.isPaused;
  }
  if (!endDate && close) {
    endDate = (currentClass && currentClass.length > 0
      ? maxBy(currentClass, "closedDate") || currentClass[currentClass.length - 1]
      : {}
    ).closedDate;
  }
  const lastAttempt = maxBy(reports, o => parseInt(o.startDate)) || {};
  // if last test attempt was not *submitted*, user should be able to resume it.
  const resume = lastAttempt.status == 0;
  const absent = lastAttempt.status == 2;
  const graded =
    lastAttempt.graded && lastAttempt.graded.toLowerCase() === "in grading" ? "submitted" : lastAttempt.graded;
  let newReports = resume ? reports.slice(0, reports.length - 1) : reports.slice(0);
  newReports = newReports || [];
  const attempted = !!(newReports && newReports.length);
  const attemptCount = newReports && newReports.length;
  //To handle regrade reduce max attempt settings.
  if (maxAttempts < reports.length && !isNaN(maxAttempts)) {
    maxAttempts = reports.length;
  }
  return {
    ...assignment,
    startDate,
    endDate,
    open,
    close,
    isPaused,
    absent,
    graded,
    attempted,
    attemptCount,
    maxAttempts,
    lastAttempt,
    resume
  };
};
