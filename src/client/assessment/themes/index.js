import React, { useEffect, useRef, useState, useMemo } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
import { isUndefined } from "lodash";

import useInterval from "@use-it/interval";

import { gotoItem, saveUserResponse } from "../actions/items";
import { finishTestAcitivityAction } from "../actions/test";
import { evaluateAnswer } from "../actions/evaluation";
import { changePreview as changePreviewAction } from "../actions/view";
import { getQuestionsByIdSelector } from "../selectors/questions";
import { testLoadingSelector } from "../selectors/test";
import { startAssessmentAction } from "../actions/assessment";
import { getAnswersArraySelector, getAnswersListSelector } from "../selectors/answers";
import AssessmentPlayerDefault from "./AssessmentPlayerDefault";
import AssessmentPlayerSimple from "./AssessmentPlayerSimple";
import AssessmentPlayerDocBased from "./AssessmentPlayerDocBased";

const shouldAutoSave = itemRows => {
  if (!itemRows) {
    return false;
  }
  const autoSavableTypes = {
    essayRichText: 1,
    essayPlainText: 1,
    formulaessay: 1
  };
  for (let row of itemRows) {
    for (let widget of row.widgets || []) {
      if (widget.widgetType === "question" && autoSavableTypes[widget.type]) {
        return true;
      }
    }
  }
  return false;
};

const AssessmentContainer = ({
  view,
  items,
  title,
  defaultAP,
  finishTest,
  history,
  changePreview,
  startAssessment,
  saveUserResponse: saveUserAnswer,
  evaluateAnswer: evaluate,
  match,
  url,
  gotoItem,
  docUrl,
  annotations,
  questionsById,
  answers,
  answersById,
  loading,
  preview
}) => {
  const qid = preview ? 0 : match.params.qid || 0;
  const [currentItem, setCurrentItem] = useState(Number(qid));
  gotoItem(currentItem);
  saveUserAnswer(currentItem, 0);
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  // start assessment
  useEffect(() => {
    startAssessment();
  }, []);

  const lastTime = useRef(Date.now());

  useEffect(() => {
    lastTime.current = Date.now();
    setCurrentItem(Number(qid));
  }, [qid]);

  const gotoQuestion = index => {
    setCurrentItem(index);

    if (preview) return;

    const timeSpent = Date.now() - lastTime.current;
    history.push(`${url}/qid/${index}`);
    changePreview("clear");
    saveUserAnswer(currentItem, timeSpent);
  };

  const moveToNext = () => {
    if (!isLast()) {
      gotoQuestion(Number(currentItem) + 1);
    }
    if (isLast() && !preview) {
      const timeSpent = Date.now() - lastTime.current;
      history.push("/student/test-summary");
      saveUserAnswer(currentItem, timeSpent);
    }
  };

  const saveProgress = () => {
    const timeSpent = Date.now() - lastTime.current;
    saveUserAnswer(currentItem, timeSpent);
  };

  const gotoSummary = () => {
    const timeSpent = Date.now() - lastTime.current;
    history.push("/student/test-summary");
    saveUserAnswer(currentItem, timeSpent);
  };

  const moveToPrev = () => {
    if (!isFirst()) gotoQuestion(Number(currentItem) - 1);
  };

  const itemRows = items[currentItem] && items[currentItem].rows;

  const autoSave = useMemo(() => shouldAutoSave(itemRows), [itemRows]);

  useInterval(() => {
    if (autoSave) {
      saveUserAnswer(currentItem, Date.now() - lastTime.current, true);
    }
  }, 1000 * 30);

  const props = {
    items,
    isFirst,
    isLast,
    moveToNext,
    moveToPrev,
    currentItem,
    title,
    gotoQuestion,
    itemRows,
    evaluate,
    view,
    finishTest,
    history,
    previewPlayer: preview
  };

  if (loading) {
    return <Spin />;
  }

  if (!isUndefined(docUrl)) {
    return (
      <AssessmentPlayerDocBased
        docUrl={docUrl}
        annotations={annotations}
        questionsById={questionsById}
        answers={answers}
        answersById={answersById}
        saveProgress={saveProgress}
        gotoSummary={gotoSummary}
        {...props}
      />
    );
  }

  return defaultAP ? <AssessmentPlayerDefault {...props} /> : <AssessmentPlayerSimple {...props} />;
};

AssessmentContainer.propTypes = {
  gotoItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  docUrl: PropTypes.string,
  annotations: PropTypes.array,
  answers: PropTypes.array.isRequired,
  answersById: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

AssessmentContainer.defaultProps = {
  docUrl: undefined,
  annotations: []
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      view: state.view.preview,
      items: state.test.items,
      title: state.test.title,
      docUrl: state.test.docUrl,
      annotations: state.test.annotations,
      questionsById: getQuestionsByIdSelector(state),
      answers: getAnswersArraySelector(state),
      answersById: getAnswersListSelector(state),
      loading: testLoadingSelector(state)
    }),
    {
      saveUserResponse,
      evaluateAnswer,
      changePreview: changePreviewAction,
      startAssessment: startAssessmentAction,
      finishTest: finishTestAcitivityAction,
      gotoItem
    }
  )
);

export default enhance(AssessmentContainer);
