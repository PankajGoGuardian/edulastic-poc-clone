import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { get } from "lodash";
import { Spin, message } from "antd";
import { notification } from "@edulastic/common";
import styled from "styled-components";
import { greyLight1 } from "@edulastic/colors";
import { TokenStorage, testsApi } from "@edulastic/api";
import { test as testConstants } from "@edulastic/constants";
import ViewModal from "../../author/TestList/components/ViewModal";
import TestPreviewModal from "../../author/Assignments/components/Container/TestPreviewModal";
import { fetchTestAction, getAllAssignmentsSelector, fetchAssignmentsByTestAction } from "../ducks";
import { startAssignmentAction, resumeAssignmentAction } from "../../student/Assignments/ducks";
import { getUser } from "../../author/src/selectors/user";
import { redirectToStudentPage, redirectToDashbord } from "../utils";

import { fetchUserAction } from "../../student/Login/ducks";

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
  resumeAssignment,
  fetchUser
}) => {
  const { testId } = match.params;
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [publicTest, setPublicTest] = useState();

  const redirectToTestPreview = (_testId, isTestArchieved = false, isTestInDraft = false) => {
    if (isTestArchieved || isTestInDraft) {
      notification({ msg: isTestInDraft ? "Test not found" : ARCHIVED_TEST_MSG });
      history.push(`/author/tests`);
    } else {
      history.push(`/author/tests/tab/review/id/${_testId}`);
    }
  };

  // if user loggedin and role is student, then fetch assignments for current student for specific test
  // if not authenticating or no authenticated token exist, then fetch test detail to show summary
  useEffect(() => {
    if (user) {
      const { role } = user;
      // fetch test to check if test archieved or not
      testsApi
        .getPublicTest(testId, { sharedType: "PUBLIC" })
        .then(_test => {
          const isTestArchieved = _test.status === testConstants.statusConstants.ARCHIVED;
          const isTestInDraft = _test.status === testConstants.statusConstants.DRAFT;

          if (role === "student") {
            fetchAssignments({ testId: _test._id });
            setPublicTest(_test);
          } else if (role === "parent") {
            let msgType = "";
            if (isTestArchieved) {
              msgType = "ARCHIVED";
            } else if (isTestInDraft) {
              msgType = "NOT_FOUND";
            }
            redirectToDashbord(msgType, history);
          } else {
            redirectToTestPreview(_test._id, isTestArchieved, isTestInDraft);
          }
        })
        .catch(() => {
          notification({ type: "info", messageKey: "tryingToAccessPrivateTest" });
          if (role !== "student" || role !== "parent") {
            redirectToTestPreview(testId);
          } else {
            // if got error redirect to login page
            history.push("/");
          }
        });
    } else if (!authenticating || !TokenStorage.getAccessToken()) {
      if (!test) {
        fetchTest({ testId, sharedType: "PUBLIC" });
      } else if (
        test?.status === testConstants.statusConstants.ARCHIVED ||
        test?.status === testConstants.statusConstants.DRAFT
      ) {
        const msg = test?.status === testConstants.statusConstants.ARCHIVED ? ARCHIVED_TEST_MSG : "Test not found";
        notification({ type: "info", msg });
        history.push("/login");
      }
    } else {
      fetchUser();
    }
  }, [user, test]);

  // check for ungraded assignments, if exists consider that assignment for to redirect to assessment player
  // if no assignments found, then redirect to student dashbord
  // if only graded assignments found, then redirect to review page
  useEffect(() => {
    if (user && user?.role === "student" && loadingAssignments === false) {
      redirectToStudentPage(assignments, history, startAssignment, resumeAssignment, publicTest);
    }
  }, [loadingAssignments]);

  const getCurrentPath = () => {
    const location = window.location || {};
    return `${location.pathname}${location.search}${location.hash}`;
  };

  // on click of assign button in test summary view
  const assignTest = e => {
    e && e.stopPropagation();

    // if public shared url then save the url so that it can be used for student redirection after auth
    if (!localStorage.getItem("defaultTokenKey")) {
      localStorage.setItem("publicUrlAccess", getCurrentPath());
    }

    history.push({
      pathname: `/author/assignments/${test._id}`,
      state: { from: "testLibrary", fromText: "Test Library", toUrl: "/author/tests" }
    });
  };

  const handleShowPreviewModal = () => setShowPreviewModal(true);

  // if test is not public, then redirect to login page
  if (error) {
    notification({ messageKey:"tryingToAccessPrivateTest"});
    return <Redirect to="/login" />;
  }
  if (loading || !test || (authenticating && TokenStorage.getAccessToken())) {
    return <Spin />;
  }

  const { isLoading = false } = history.location.state || {};

  return !isLoading ? (
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
          testId={test?._id || testId}
          closeTestPreviewModal={() => setShowPreviewModal(false)}
          demo
          sharedType="PUBLIC"
        />
      )}
    </StyledMainWrapper>
  ) : (
    <Spin />
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
    resumeAssignment: resumeAssignmentAction,
    fetchUser: fetchUserAction
  }
)(PublicTestPage);
