// @ts-check
import React, { useMemo } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import useInterval from "@use-it/interval";
import { assignmentPolicyOptions as Policies } from "@edulastic/constants";
import {
  realtimeGradebookActivityAddAction,
  gradebookTestItemAddAction,
  realtimeGradebookActivitySubmitAction,
  realtimeGradebookQuestionAddMaxScoreAction,
  realtimeGradebookQuestionsRemoveAction,
  realtimeGradebookRedirectAction,
  realtimeGradebookCloseAction,
  realtimeUpdateAssignmentAction
  , recalculateAdditionalDataAction
} from "../../../src/reducers/testActivity";
import useRealtimeUpdates from "../../useRealtimeUpdates";
import { receiveTestActivitydAction } from "../../../src/actions/classBoard";


const needRealtimeDateTracking = ({ openPolicy, closePolicy, startDate, endDate }) => {
  const now = Date.now();
  const openingTimeFromNowInHours = (startDate - now) / (1000 * 60 * 60);
  const closingTimeFromNowInHours = (endDate - now) / (1000 * 60 * 60);
  if (
    openPolicy === Policies.POLICY_AUTO_ON_STARTDATE &&
    openingTimeFromNowInHours > 0 &&
    openingTimeFromNowInHours <= 24
  ) {
    return true;
  } else if (
    closePolicy === Policies.POLICY_AUTO_ON_DUEDATE &&
    closingTimeFromNowInHours > 0 &&
    closingTimeFromNowInHours <= 24
  ) {
    return true;
  }
  return false;
};

const Shell = ({
  addActivity,
  classId,
  assignmentId,
  addItem,
  match,
  loadTestActivity,
  submitActivity,
  removeQuestions,
  addQuestionsMaxScore,
  closeAssignment,
  realtimeUpdateAssignment,
  recalculateAssignment,
  additionalData
}) => {
  const redirectCheck = payload => {
    const { assignmentId, classId } = match.params;
    loadTestActivity(assignmentId, classId);
  };

  const { openPolicy, closePolicy, startDate, endDate } = additionalData || {};

  const dateTrackingNeeded = useMemo(() => needRealtimeDateTracking({ openPolicy, closePolicy, startDate, endDate }), [
    openPolicy,
    closePolicy,
    startDate,
    endDate
  ]);

  useInterval(() => {
    if (dateTrackingNeeded) {
      recalculateAssignment();
    }
  }, 60 * 1000);

  const client = useRealtimeUpdates(`gradebook:${classId}:${assignmentId}`, {
    addActivity,
    addItem,
    submitActivity,
    redirect: redirectCheck,
    // "assignment:close": closeAssignment,
    assignment: () => {
      const { assignmentId, classId } = match.params;
      loadTestActivity(assignmentId, classId)
    }
    // TODO: need to comeback to it when we need to handle realtime impact of regrading
    // removeQuestions,
    // addQuestionsMaxScore
  });

  return null;
};

export default compose(
  withRouter,
  connect(
    null,
    {
      addActivity: realtimeGradebookActivityAddAction,
      addItem: gradebookTestItemAddAction,
      submitActivity: realtimeGradebookActivitySubmitAction,
      removeQuestions: realtimeGradebookQuestionsRemoveAction,
      addQuestionsMaxScore: realtimeGradebookQuestionAddMaxScoreAction,
      loadTestActivity: receiveTestActivitydAction,
      redirect: realtimeGradebookRedirectAction,
      closeAssignment: realtimeGradebookCloseAction,
      realtimeUpdateAssignment: realtimeUpdateAssignmentAction,
      recalculateAssignment: recalculateAdditionalDataAction
    }
  )
)(Shell);
