//@ts-check
import React from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  realtimeGradebookActivityAddAction,
  realtimeGradebookTestItemAddAction,
  realtimeGradebookActivitySubmitAction,
  realtimeGradebookQuestionAddMaxScoreAction,
  realtimeGradebookQuestionsRemoveAction,
  realtimeGradebookRedirectAction
} from "../../../src/reducers/testActivity";
import useRealtimeUpdates from "../../useRealtimeUpdates";
import { receiveTestActivitydAction } from "../../../src/actions/classBoard";

const Shell = ({
  addActivity,
  classId,
  assignmentId,
  addItem,
  match,
  loadTestActivity,
  submitActivity,
  removeQuestions,
  addQuestionsMaxScore
}) => {
  const redirectCheck = payload => {
    const { assignmentId, classId } = match.params;
    loadTestActivity(assignmentId, classId);
  };
  const client = useRealtimeUpdates(`gradebook:${classId}:${assignmentId}`, {
    addActivity,
    addItem,
    submitActivity,
    redirect: redirectCheck
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
      addItem: realtimeGradebookTestItemAddAction,
      submitActivity: realtimeGradebookActivitySubmitAction,
      removeQuestions: realtimeGradebookQuestionsRemoveAction,
      addQuestionsMaxScore: realtimeGradebookQuestionAddMaxScoreAction,
      loadTestActivity: receiveTestActivitydAction,
      redirect: realtimeGradebookRedirectAction
    }
  )
)(Shell);
