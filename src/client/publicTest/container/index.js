import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { get, maxBy } from "lodash";
import { Spin, message, Modal } from "antd";
import styled from "styled-components";
import { greyLight1, themeColor } from "@edulastic/colors";
import ViewModal from "../../author/TestList/components/ViewModal";
import TestPreviewModal from "../../author/Assignments/components/Container/TestPreviewModal";
import { fetchTestAction, getAllAssignmentsSelector, fetchAssignmentsByTestAction } from "../ducks";
import { startAssignmentAction, resumeAssignmentAction } from "../../student/Assignments/ducks";
import { getUser } from "../../author/src/selectors/user";
import { TokenStorage } from "@edulastic/api";
import { formatAssignment } from "../utils";

const PublicTestPage = ({
  match,
  fetchTest,
  loading,
  test,
  error,
  history,
  user,
  fetchAssignments,
  authenticating,
  assignments,
  loadingAssignments,
  startAssignment,
  resumeAssignment
}) => {
  const { testId } = match.params;
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  //if user loggedin and role is student, then fetch assignments for current student for specific test
  // if not authenticating or no authenticated token exist, then fetch test detail to show summary
  useEffect(() => {
    if (user) {
      const { role } = user;
      if (role === "student") {
        fetchAssignments({ testId });
      } else if (role === "parent") {
        redirectToDashbord();
      } else {
        redirectToTestPreview();
      }
    } else if (!authenticating || !TokenStorage.getAccessToken()) {
      fetchTest({ testId, sharedType: "PUBLIC" });
    }
  }, [user]);

  //check for ungraded assignments, if exists consider that assignment for to redirect to assessment player
  //if no assignments found, then redirect to student dashbord
  //if only graded assignments found, then redirect to review page
  useEffect(() => {
    if (user && user?.role === "student" && loadingAssignments === false) {
      const formatedAssignments = assignments.map(assignment => formatAssignment(assignment));
      //filter assignments open to start/resume
      const filteredAssignments = formatedAssignments.filter(
        a => !(new Date(a.startDate) > new Date() || !a.startDate || a.isPaused)
      );

      if (filteredAssignments.length > 0) {
        //filter ungraded assignments
        const ungradedAssignments = filteredAssignments.filter(a => !a.graded);
        let assignment = maxBy(filteredAssignments, "createdAt");
        if (ungradedAssignments.length) {
          assignment = maxBy(ungradedAssignments, "createdAt");
        }
        redirectToAssessmentPlayer(assignment);
      } else {
        //redirect to student dashboard
        redirectToDashbord("NOT OPEN");
      }
    }
  }, [loadingAssignments]);

  const redirectToDashbord = (type = "") => {
    let msg;
    switch (type) {
      case "NOT_OPEN":
        msg = "Assignment is not available for the attempt.";
      case "EXPIRED":
        msg = "Test is expired";
      default:
        msg = "Redirect to student dashboard";
    }
    message.warn(msg);
    history.push("/home/assignments");
  };

  const redirectToTestPreview = () => history.push(`/author/tests/tab/review/id/${testId}`);

  //case: check to where to navigate
  const redirectToAssessmentPlayer = assignment => {
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
      title
    } = assignment;

    // if assignment is graded, then redirected to assignment review page
    if (graded) {
      return history.push({
        pathname: `/home/class/${classId}/test/${testId}/testActivityReport/${lastAttempt._id}`,
        testActivityId: lastAttempt._id,
        title
      });
    }
    //if end date is crossed, then redirect to student dashboard
    if (endDate < Date.now()) {
      return redirectToDashbord("EXPIRED");
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
        onCancel: redirectToDashbord,
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
    //case assignment is not resumed, then start assignment from fresh
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

  //on click of assign button in test summary view
  const assignTest = e => {
    e && e.stopPropagation();
    history.push({
      pathname: `/author/assignments/${test._id}`,
      state: { from: "testLibrary", fromText: "Test Library", toUrl: "/author/tests" }
    });
  };

  const handleShowPreviewModal = () => setShowPreviewModal(true);

  //if test is not public, then redirect to login page
  if (error) {
    message.error("Trying to access private test");
    return <Redirect to="/login" />;
  } else if (loading || !test || (authenticating && TokenStorage.getAccessToken())) {
    return <Spin />;
  }
  return (
    <StyledMainWrapper>
      <ViewModal
        item={test}
        modalView={false}
        publicAccess
        assign={assignTest}
        status={test.status}
        previewLink={handleShowPreviewModal}
      />
      {showPreviewModal && (
        <TestPreviewModal
          isModalVisible
          testId={testId}
          closeTestPreviewModal={() => setShowPreviewModal(false)}
          demo
          sharedType="PUBLIC"
        />
      )}
    </StyledMainWrapper>
  );
};

const StyledMainWrapper = styled.div`
  width: 50%;
  margin: auto;
  margin-top: 20px;
  .scrollbar-container {
    max-height: 100%;
    position: relative;
    top: 0;
  }
  .public-access-btn-wrapper {
    display: flex;
    flex-direction: column;
    button {
      margin-left: 0;
    }
    button + button {
      margin-top: 30px;
    }
  }
  .ant-card-bordered {
    border: 1px solid ${greyLight1};
    padding: 40px;
  }
`;

export default connect(
  state => ({
    loading: state.publicTest.loading,
    test: get(state, "publicTest.test"),
    error: get(state, "publicTest.error"),
    user: getUser(state),
    authenticating: get(state, "user.authenticating", false),
    assignments: getAllAssignmentsSelector(state),
    loadingAssignments: get(state, "publicTest.loadingAssignments")
  }),
  {
    fetchTest: fetchTestAction,
    fetchAssignments: fetchAssignmentsByTestAction,
    startAssignment: startAssignmentAction,
    resumeAssignment: resumeAssignmentAction
  }
)(PublicTestPage);
