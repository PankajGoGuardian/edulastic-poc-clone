import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { get } from "lodash";
import { Spin } from "antd";
// components
import TestAcivityHeader from "../../sharedComponents/Header";
import TestActivitySubHeader from "./SubHeader";
import ReportListContent from "./Container";
import MainContainer from "../../styled/mainContainer";
// actions
import { loadTestActivityReportAction } from "../ducks";
import { setCurrentItemAction } from "../../sharedDucks/TestItem";
import { getTestEntitySelector } from "../../../author/TestPage/ducks";
import Worksheet from "../../../author/AssessmentPage/components/Worksheet/Worksheet";
import { getQuestionsSelector, getQuestionsArraySelector } from "../../../author/sharedDucks/questions";
import { clearUserWorkAction } from "../../../assessment/actions/userWork";

const ReportListContainer = ({
  flag,
  match,
  location,
  test,
  loadTestActivityReport,
  setCurrentItem,
  questions,
  questionsById,
  testTitle,
  testFeedback,
  clearUserWork
}) => {
  const [assignmentItemTitle, setAssignmentItemTitle] = useState(null);

  useEffect(() => {
    loadTestActivityReport({
      testId: match.params.testId,
      testActivityId: match.params.id,
      groupId: match.params.classId
    });
    setCurrentItem(0);
    return () => {
      clearUserWork();
    };
  }, []);

  const { isDocBased, docUrl, annotations, pageStructure, freeFormNotes = {} } = test;

  const props = {
    docUrl,
    annotations,
    questions,
    freeFormNotes,
    questionsById,
    pageStructure
  };

  useEffect(() => {
    if (!testFeedback) return;
    setAssignmentItemTitle(testTitle);
  }, [testFeedback]);

  if (!testFeedback) {
    return <Spin />;
  }
  return (
    <MainContainer flag={flag}>
      <TestAcivityHeader titleText="common.reportsTitle" />
      <TestActivitySubHeader title={assignmentItemTitle} isDocBased={isDocBased} />
      {isDocBased ? (
        <div style={{ height: "calc(100vh - 130px)" }}>
          <Worksheet key="review" review {...props} viewMode="report" />
        </div>
      ) : (
        <ReportListContent title={assignmentItemTitle} reportId={match.params.id} />
      )}
    </MainContainer>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      flag: state.ui.flag,
      test: getTestEntitySelector(state),
      testFeedback: get(state, "testFeedback", null),
      questions: getQuestionsArraySelector(state),
      questionsById: getQuestionsSelector(state),
      testTitle: get(state, ["tests", "entity", "title"], "")
    }),
    {
      setCurrentItem: setCurrentItemAction,
      loadTestActivityReport: loadTestActivityReportAction,
      clearUserWork: clearUserWorkAction
    }
  )
);

export default enhance(ReportListContainer);

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  assignments: PropTypes.array.isRequired,
  testFeedback: PropTypes.array.isRequired,
  clearUserWork: PropTypes.func.isRequired
};
