import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import { Spin, message } from "antd";
import styled from "styled-components";
import { greyLight1 } from "@edulastic/colors";
import ViewModal from "../../author/TestList/components/ViewModal";
import TestPreviewModal from "../../author/Assignments/components/Container/TestPreviewModal";
import { fetchTestAction, getAllAssignmentsSelector, fetchAssignmentsByTestAction } from "../ducks";
import { startAssignmentAction, resumeAssignmentAction } from "../../student/Assignments/ducks";
import { getUser } from "../../author/src/selectors/user";
import { TokenStorage } from "@edulastic/api";
import { redirectToStudentPage } from "../utils";
import { test as testConstants } from "@edulastic/constants";
import { testsApi } from "@edulastic/api";

const ARCHIVED_TEST_MSG = "You can no longer use this as sharing access has been revoked by author";

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
      //fetch test to check if test archieved or not
      testsApi
        .getPublicTest(testId, { sharedType: "PUBLIC" })
        .then(test => {
          const isTestArchieved = test.status === testConstants.statusConstants.ARCHIVED;

          if (role === "student") {
            //if archieved, then redirect to student dashbord
            if (isTestArchieved) {
              return redirectToDashbord(isTestArchieved ? "ARCHIVED" : "");
            } else {
              fetchAssignments({ testId });
            }
          } else if (role === "parent") {
            redirectToDashbord(isTestArchieved ? "ARCHIVED" : "");
          } else {
            redirectToTestPreview(isTestArchieved);
          }
        })
        .catch(() => {
          message.warn("Trying to access private test");
          if (role !== "student" || role !== "parent") {
            redirectToTestPreview();
          } else {
            //if got error redirect to login page
            history.push("/login");
          }
        });
    } else if (!authenticating || !TokenStorage.getAccessToken()) {
      if (!test) {
        fetchTest({ testId, sharedType: "PUBLIC" });
      } else if (test?.status === testConstants.statusConstants.ARCHIVED) {
        message.warn(ARCHIVED_TEST_MSG);
        history.push("/login");
      }
    }
  }, [user, test]);

  //check for ungraded assignments, if exists consider that assignment for to redirect to assessment player
  //if no assignments found, then redirect to student dashbord
  //if only graded assignments found, then redirect to review page
  useEffect(() => {
    if (user && user?.role === "student" && loadingAssignments === false) {
      redirectToStudentPage(assignments, history, startAssignment, resumeAssignment);
    }
  }, [loadingAssignments]);

  const redirectToTestPreview = isTestArchieved => {
    if (isTestArchieved) {
      message.warn(ARCHIVED_TEST_MSG);
      history.push(`/author/tests`);
    } else {
      history.push(`/author/tests/tab/review/id/${testId}`);
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
