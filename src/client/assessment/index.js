/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { compose } from "redux";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Prompt } from "react-router-dom";
// themes
import ThemeContainer from "./themes/index";
import { loadTestAction } from "./actions/test";
import { startAssessmentAction } from "./actions/assessment";
import { testActivityLoadingSelector } from "./selectors/test";
import RequirePassword from "./RequirePassword";

const AssessmentPlayer = ({
  defaultAP,
  loadTest,
  match,
  preview = false,
  testId,
  demo,
  isPasswordValidated,
  testActivityLoading,
  test,
  LCBPreviewModal,
  closeTestPreviewModal,
  isShowStudentWork = false,
  showTools,
  startAssessment,
  passages,
  playlistId,
  studentReportModal,
  currentAssignmentId,
  currentAssignmentClass,
  ...restProps
}) => {
  useEffect(() => {
    testId = preview ? testId : match.params.id;
    const { utaId: testActivityId, groupId } = match.params;
    // if its from a modal that maybe showing the answer, then dont reset the answer.
    if (!LCBPreviewModal) startAssessment();
    // if showing student work dont genrate question labels again
    loadTest({
      testId,
      testActivityId,
      preview,
      demo,
      test,
      groupId: groupId || currentAssignmentClass,
      isShowStudentWork,
      playlistId,
      currentAssignmentId
    });
  }, [testId]);

  const confirmBeforeQuitting = e => {
    // for older IE versions
    e = e || window.event;
    if (e) {
      e.returnValue = "Are you sure you want to quit?";
    }
    // for modern browsers
    // note: for modern browsers support for custom messages has been deprecated
    return "Are you sure you want to quit";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", confirmBeforeQuitting);
    return () => {
      window.removeEventListener("beforeunload", confirmBeforeQuitting);
    };
  }, []);

  if (preview) {
    return (
      <ThemeContainer
        closeTestPreviewModal={closeTestPreviewModal}
        LCBPreviewModal={LCBPreviewModal}
        test={test}
        defaultAP
        preview
        showTools={showTools}
        showScratchPad={isShowStudentWork}
        passages={passages}
        studentReportModal={studentReportModal}
        {...restProps}
      />
    );
  }
  if (testActivityLoading) {
    return <Spin />;
  }
  if (!isPasswordValidated) {
    return <RequirePassword />;
  }
  const groupId = match.params.groupId || "";
  const utaId = match.params?.utaId;

  return (
    <>
      <Switch>
        <Route
          path={`${match.url}/qid/:qid`}
          render={() => (
            <ThemeContainer passages={passages} utaId={utaId} defaultAP={defaultAP} url={match.url} groupId={groupId} />
          )}
        />

        <Route
          path={`${match.url}`}
          render={() => (
            <ThemeContainer
              passages={passages}
              utaId={utaId}
              defaultAP={defaultAP}
              url={match.url}
              testletType
              groupId={groupId}
            />
          )}
        />
      </Switch>
      <Prompt
        message={location => {
          if (
            location.pathname.match(new RegExp("/student/assessment/.*/class/.*/uta/.*/qid/.*")) ||
            location.pathname.match(new RegExp("/student/assessment/.*/class/.*/uta/.*/test-summary"))
          ) {
            return undefined;
          }
          return "You are navigating away and you will quit the assignment. Are you sure?";
        }}
      />
    </>
  );
};

AssessmentPlayer.propTypes = {
  defaultAP: PropTypes.any.isRequired,
  loadTest: PropTypes.func.isRequired,
  match: PropTypes.any.isRequired,
  preview: PropTypes.any,
  testId: PropTypes.string,
  test: PropTypes.object,
  LCBPreviewModal: PropTypes.any.isRequired
};

AssessmentPlayer.defaultProps = {
  preview: false,
  testId: "",
  test: {}
};

// export component
const enhance = compose(
  withRouter,
  connect(
    state => ({
      isPasswordValidated: state.test.isPasswordValidated,
      testActivityLoading: testActivityLoadingSelector(state)
    }),
    {
      loadTest: loadTestAction,
      startAssessment: startAssessmentAction
    }
  )
);
export default enhance(AssessmentPlayer);
