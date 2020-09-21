import { MainContentWrapper } from "@edulastic/common";
import { IconReport } from "@edulastic/icons";
import { Spin } from "antd";
import { get } from "lodash";
import PropTypes from "prop-types";
import { test as testConstants } from "@edulastic/constants";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { clearUserWorkAction } from "../../../assessment/actions/userWork";
import { getQuestionsArraySelector, getQuestionsSelector } from "../../../author/sharedDucks/questions";
import { getTestEntitySelector } from "../../../author/TestPage/ducks";
// components
import TestAcivityHeader from "../../sharedComponents/Header";
import { getCurrentItemSelector, setCurrentItemAction } from "../../sharedDucks/TestItem";
import MainContainer from "../../styled/mainContainer";
// actions
import { loadTestActivityReportAction } from "../ducks";
import ReportListContent from "./Container";
import TestActivitySubHeader from "./SubHeader";
import ProgressGraph from "./ProgressGraph";

const { releaseGradeLabels } = testConstants;
const continueBtns = [releaseGradeLabels.WITH_ANSWERS, releaseGradeLabels.WITH_RESPONSE];

const ReportListContainer = ({
  flag,
  match,
  test,
  loadTestActivityReport,
  setCurrentItem,
  currentItem,
  testTitle,
  testFeedback,
  clearUserWork,
  history,
  isCliUser
}) => {
  const [assignmentItemTitle, setAssignmentItemTitle] = useState(null);
  const [showGraph, setShowGraph] = useState(true);
  const { isDocBased, releaseScore } = test;

  const setCurrentItemFromGraph = qIndex => {
    if (continueBtns.includes(releaseScore)) {
      setCurrentItem(qIndex);
      setShowGraph(false);
    }
  };

  const continueReview = () => {
    setCurrentItem(0);
    setShowGraph(false);
  };

  const showSummaryView = () => {
    setCurrentItem(0);
    setShowGraph(true);
  };

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

  useEffect(() => {
    if (!testFeedback) {
      return;
    }

    if (!showGraph) {
      setAssignmentItemTitle(<AssignmentItemTitleView onClick={showSummaryView}>{testTitle}</AssignmentItemTitleView>);
    } else {
      setAssignmentItemTitle(testTitle);
    }
  }, [testFeedback, showGraph]);

  if (!testFeedback) {
    return <Spin />;
  }

  const showContinue = continueBtns.includes(releaseScore) && showGraph;

  return (
    <MainContainer flag={flag}>
      <TestAcivityHeader
        isDocBased={isDocBased}
        titleIcon={IconReport}
        titleText={test?.title || ""}
        history={history}
        showExit={!isCliUser}
        showContinue={showContinue}
        continueReview={continueReview}
        hideSideMenu={isCliUser}
      />
      <MainContentWrapper padding={isDocBased ? "0px" : "20px 30px"}>
        <TestActivitySubHeader
          title={assignmentItemTitle}
          questionLabel={showGraph ? null : `Q${currentItem + 1}`}
          isDocBased={isDocBased}
          isCliUser={isCliUser}
          hideQuestionSelect={showGraph}
        />
        {showGraph && <ProgressGraph setCurrentItem={setCurrentItemFromGraph} />}
        {!showGraph && <ReportListContent title={assignmentItemTitle} reportId={match.params.id} />}
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
      currentItem: getCurrentItemSelector(state),
      testFeedback: get(state, "testFeedback", null),
      questions: getQuestionsArraySelector(state),
      questionsById: getQuestionsSelector(state),
      testTitle: get(state, ["tests", "entity", "title"], ""),
      isCliUser: get(state, "user.isCliUser", false)
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
  testFeedback: PropTypes.array.isRequired,
  clearUserWork: PropTypes.func.isRequired
};

const AssignmentItemTitleView = styled.span`
  cursor: pointer;
`;
