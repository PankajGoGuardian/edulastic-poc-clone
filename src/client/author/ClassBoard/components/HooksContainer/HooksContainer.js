//@ts-check
import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import useInterval from "@use-it/interval";
import {
  realtimeGradebookActivityAddAction,
  gradebookTestItemAddAction,
  realtimeGradebookActivitySubmitAction,
  realtimeGradebookQuestionAddMaxScoreAction,
  realtimeGradebookQuestionsRemoveAction,
  realtimeGradebookRedirectAction,
  realtimeGradebookCloseAction,
  realtimeUpdateAssignmentAction
} from "../../../src/reducers/testActivity";
import useRealtimeUpdates from "../../useRealtimeUpdates";
import { receiveTestActivitydAction } from "../../../src/actions/classBoard";
import { recalculateAdditionalDataAction } from "../../../src/reducers/testActivity";

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
  recalculateAssignment
}) => {
  const redirectCheck = payload => {
    const { assignmentId, classId } = match.params;
    loadTestActivity(assignmentId, classId);
  };

  useInterval(() => recalculateAssignment(), 60 * 1000);

  const client = useRealtimeUpdates(`gradebook:${classId}:${assignmentId}`, {
    addActivity,
    addItem,
    submitActivity,
    redirect: redirectCheck,
    "assignment:close": closeAssignment,
    assignment: realtimeUpdateAssignment
    //TODO: need to comeback to it when we need to handle realtime impact of regrading
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
