import { MainContentWrapper } from "@edulastic/common";
import { IconReport } from "@edulastic/icons";
import { Spin } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { clearUserWorkAction } from "../../../assessment/actions/userWork";
import Worksheet from "../../../author/AssessmentPage/components/Worksheet/Worksheet";
import { getQuestionsArraySelector, getQuestionsSelector } from "../../../author/sharedDucks/questions";
import { getTestEntitySelector } from "../../../author/TestPage/ducks";
// components
import TestAcivityHeader from "../../sharedComponents/Header";
import { setCurrentItemAction } from "../../sharedDucks/TestItem";
import MainContainer from "../../styled/mainContainer";
// actions
import { loadTestActivityReportAction } from "../ducks";
import ReportListContent from "./Container";
import TestActivitySubHeader from "./SubHeader";

const ReportListContainer = ({
  flag,
  match,
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
      <TestAcivityHeader isDocBased={isDocBased} titleIcon={IconReport} titleText="common.reportsTitle" />
      <MainContentWrapper padding={isDocBased ? "0px" : "20px 50px"}>
        <TestActivitySubHeader title={assignmentItemTitle} isDocBased={isDocBased} />
        {isDocBased ? (
          <div>
            <Worksheet key="review" review {...props} viewMode="report" />
          </div>
        ) : (
          <ReportListContent title={assignmentItemTitle} reportId={match.params.id} />
        )}
      </MainContentWrapper>
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
  assignments: PropTypes.array.isRequired,
  testFeedback: PropTypes.array.isRequired,
  clearUserWork: PropTypes.func.isRequired
};
