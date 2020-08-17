import React from "react";
import { maxBy } from "lodash";
import { Modal } from "antd";
import { notification } from "@edulastic/common";
import { themeColor } from "@edulastic/colors";
import { test as testConstants } from "@edulastic/constants";

const releaseGradeLabels = testConstants.releaseGradeLabels;
const ARCHIVED_TEST_MSG = "You can no longer use this as sharing access has been revoked by author";

// this is to format assignment, to included different state like, resume/absent/startDate/endDate etc
export const formatAssignment = assignment => {
  let { endDate, startDate, open = false, close = false, isPaused = false, maxAttempts = 1 } = assignment;
  const { reports = [], class: clazz = [], classId } = assignment;
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
    endDate = (currentClassList && currentClassList.length > 0
      ? maxBy(currentClassList, "closedDate") || currentClassList[currentClassList.length - 1]
      : {}
    ).closedDate;
  }
  const lastAttempt = maxBy(reports, o => parseInt(o.startDate, 10)) || {};
  // if last test attempt was not *submitted*, user should be able to resume it.
  const resume = lastAttempt.status == 0;
  const absent = lastAttempt.status == 2;
  const graded =
    lastAttempt.graded && lastAttempt.graded.toLowerCase() === "in grading" ? "submitted" : lastAttempt.graded;
  let newReports = resume ? reports.slice(0, reports.length - 1) : reports.slice(0);
  newReports = newReports || [];
  const attempted = !!(newReports && newReports.length);
  const attemptCount = newReports && newReports.length;
  // To handle regrade reduce max attempt settings.
  // eslint-disable-next-line no-restricted-globals
  if (maxAttempts < reports.length && !isNaN(maxAttempts)) {
    maxAttempts = reports.length;
  }

  let { releaseScore } = clazz.find(item => item._id === classId) || {};

  if (!releaseScore) {
    releaseScore = assignment.releaseScore;
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
    resume,
    releaseScore
  };
};

export const redirectToDashbord = (type = "", history) => {
  let msg;
  switch (type) {
    case "EXPIRED":
      msg = "Test is expired";
      break;
    case "ARCHIVED":
      msg = ARCHIVED_TEST_MSG;
      break;
    case "HOME":
      msg = "Redirecting to the student dashboard";
      break;
    case "NOT_FOUND":
      msg = "Test not found";
      break;
    default:
      msg = "Assignment is not available for the attempt.";
  }
  notification({ msg });
  history.push("/home/assignments");
};

// case: check to where to navigate
const redirectToAssessmentPlayer = (assignment, history, startAssignment, resumeAssignment) => {
  const {
    endDate,
    testId,
    _id: assignmentId,
    testType,
    maxAttempts = 1,
    timedAssignment,
    pauseAllowed,
    allowedTime,
    classId,
    resume,
    attemptCount,
    lastAttempt,
    graded,
    title,
    releaseScore
  } = assignment;
  // if assignment is graded, then redirected to assignment review page
  if (graded) {
    if (releaseScore === releaseGradeLabels.DONT_RELEASE) {
      return history.push({ pathname: "/home/grades", state: { highlightAssignment: assignmentId } });
    }
    return history.push({
      pathname: `/home/class/${classId}/test/${testId}/testActivityReport/${lastAttempt._id}`,
      testActivityId: lastAttempt._id,
      title
    });
  }
  // if end date is crossed, then redirect to student dashboard
  if (endDate < Date.now()) {
    return redirectToDashbord("EXPIRED", history);
  }

  // show confirmation modal popup
  // case assignment is not started yet and is timed assignment, then modal popup with appropriate content
  // on proceed, redirect to assessment player
  // on cancel redirect to student dashboard
  if (!resume && timedAssignment) {
    const content = pauseAllowed ? (
      <p>
        {" "}
        This is a timed assignment which should be finished within the time limit set for this assignment. The time
        limit for this assignment is{" "}
        <span data-cy="test-time" style={{ fontWeight: 700 }}>
          {" "}
          {allowedTime / (60 * 1000)} minutes
        </span>
        . Do you want to continue?
      </p>
    ) : (
      <p>
        {" "}
        This is a timed assignment which should be finished within the time limit set for this assignment. The time
        limit for this assignment is{" "}
        <span data-cy="test-time" style={{ fontWeight: 700 }}>
          {" "}
          {allowedTime / (60 * 1000)} minutes
        </span>{" "}
        and you can’t quit in between. Do you want to continue?
      </p>
    );

    Modal.confirm({
      title: "Do you want to Continue ?",
      content,
      onOk: () => {
        if (attemptCount < maxAttempts) startAssignment({ testId, assignmentId, testType, classId });
        Modal.destroyAll();
      },
      onCancel: () => redirectToDashbord("HOME", history),
      okText: "Continue",
      // okType: "danger",
      centered: true,
      width: 500,
      okButtonProps: {
        style: { background: themeColor }
      }
    });
    return;
  }

  // case assigment is resumed, then redirect to assessment player with resumed state
  // case assignment is not resumed, then start assignment from fresh
  if (resume) {
    resumeAssignment({
      testId,
      testType,
      assignmentId,
      testActivityId: lastAttempt._id,
      classId
    });
  } else if (attemptCount < maxAttempts) {
    startAssignment({ testId, assignmentId, testType, classId });
  }
};

export const redirectToStudentPage = (assignments, history, startAssignment, resumeAssignment, test) => {
  const formatedAssignments = assignments.map(assignment => formatAssignment(assignment));
  // filter assignments open to start/resume
  const filteredAssignments = formatedAssignments.filter(
    a => !(new Date(a.startDate) > new Date() || !a.startDate || a.isPaused)
  );

  if (filteredAssignments.length > 0) {
    // filter ungraded assignments
    const ungradedAssignments = filteredAssignments.filter(a => !a.graded);
    let assignment = maxBy(filteredAssignments, "createdAt");
    if (ungradedAssignments.length) {
      assignment = maxBy(ungradedAssignments, "createdAt");
    }
    redirectToAssessmentPlayer(assignment, history, startAssignment, resumeAssignment);
  } else {
    // if test is archieved/ in draft,
    // then check for assignments. if not assignment then redirect to student dashbord else navigate to student attempt page
    const isTestInDraft = test?.status === testConstants.statusConstants.DRAFT;
    const isTestArchieved = test?.status === testConstants.statusConstants.ARCHIVED;
    let msgType = "";
    if (isTestArchieved) {
      msgType = "ARCHIVED";
    } else if (isTestInDraft) {
      msgType = "NOT_FOUND";
    }
    redirectToDashbord(msgType, history);
  }
};
