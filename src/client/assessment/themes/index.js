/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState, useMemo } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
import { isUndefined, get } from "lodash";
import { ScratchPadContext } from "@edulastic/common";
import { test as testTypes } from "@edulastic/constants";
import useInterval from "@use-it/interval";

import { gotoItem as gotoItemAction, saveUserResponse } from "../actions/items";
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
import AssessmentPlayerTestlet from "./AssessmentPlayerTestlet";

const shouldAutoSave = itemRows => {
  if (!itemRows) {
    return false;
  }
  const autoSavableTypes = {
    essayRichText: 1,
    essayPlainText: 1,
    formulaessay: 1
  };
  for (const row of itemRows) {
    for (const widget of row.widgets || []) {
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
  pageStructure,
  freeFormNotes,
  passages,
  preview,
  LCBPreviewModal,
  closeTestPreviewModal,
  testletType,
  testletState,
  testletConfig,
  testType,
  test,
  groupId,
  showTools,
  showScratchPad
}) => {
  const qid = preview || testletType ? 0 : match.params.qid || 0;
  const [currentItem, setCurrentItem] = useState(Number(qid));
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now());

  // start assessment
  useEffect(() => {
    window.localStorage.assessmentLastTime = Date.now();
    // if its from a modal that maybe showing the answer, then dont reset the answer.
    if (!LCBPreviewModal) startAssessment();
  }, []);

  useEffect(() => {
    lastTime.current = Date.now();
    window.localStorage.assessmentLastTime = lastTime.current;
    setCurrentItem(Number(qid));
  }, [qid]);

  useEffect(() => {
    gotoItem(currentItem);
  }, [currentItem]);

  const gotoQuestion = index => {
    setCurrentItem(index);

    if (preview) return;

    history.push(`${url}/qid/${index}`);
    changePreview("clear");
    saveCurrentAnswer();
  };

  const saveCurrentAnswer = payload => {
    const timeSpent = Date.now() - lastTime.current;
    saveUserAnswer(currentItem, timeSpent, false, groupId, payload);
  };

  const moveToNext = async () => {
    if (!isLast()) {
      gotoQuestion(Number(currentItem) + 1);
    }
    if (isLast() && !preview) {
      const timeSpent = Date.now() - lastTime.current;
      await saveUserAnswer(currentItem, timeSpent, false, groupId);
      history.push(`${url}/${"test-summary"}`);
    }
  };

  const saveProgress = () => {
    const timeSpent = Date.now() - lastTime.current;
    saveUserAnswer(currentItem, timeSpent, false, groupId);
  };

  const gotoSummary = async () => {
    if (preview && closeTestPreviewModal) {
      return closeTestPreviewModal();
    }
    if (!testletType) {
      const timeSpent = Date.now() - lastTime.current;
      await saveUserAnswer(currentItem, timeSpent, false, groupId);
    }
    history.push(`${url}/test-summary`);
  };

  const moveToPrev = () => {
    if (!isFirst()) gotoQuestion(Number(currentItem) - 1);
  };

  const testItem = items[currentItem] || {};
  let itemRows = testItem.rows;

  if (testItem.passageId && passages) {
    const passage = passages.find(p => p._id === testItem.passageId);
    itemRows = [passage.structure, ...itemRows];
  }

  const autoSave = useMemo(() => shouldAutoSave(itemRows), [itemRows]);

  useInterval(() => {
    if (autoSave) {
      saveUserAnswer(currentItem, Date.now() - lastTime.current, true, groupId);
    }
  }, 1000 * 30);

  const props = {
    saveCurrentAnswer,
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
    pageStructure,
    freeFormNotes,
    finishTest: () => finishTest(groupId),
    history,
    previewPlayer: preview,
    LCBPreviewModal,
    closeTestPreviewModal,
    showTools,
    groupId,
    showScratchPad
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

  if (testType === testTypes.type.TESTLET || test.testType === testTypes.type.TESTLET) {
    return (
      <AssessmentPlayerTestlet
        {...props}
        testletConfig={testletConfig}
        testletState={testletState}
        saveUserAnswer={saveUserAnswer}
        gotoSummary={gotoSummary}
        {...test}
      />
    );
  }

  return (
    <>
      <ScratchPadContext.Provider value={{ enableQuestionLevelScratchPad: true }}>
        {defaultAP ? <AssessmentPlayerDefault {...props} /> : <AssessmentPlayerSimple {...props} />}
      </ScratchPadContext.Provider>
    </>
  );
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
  loading: PropTypes.bool.isRequired,
  LCBPreviewModal: PropTypes.any.isRequired,
  testType: PropTypes.string.isRequired,
  testletConfig: PropTypes.object,
  test: PropTypes.object
};

AssessmentContainer.defaultProps = {
  docUrl: undefined,
  annotations: [],
  testletConfig: {},
  test: {}
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      view: state.view.preview,
      items: state.test.items,
      passages: state.test.passages,
      title: state.test.title,
      docUrl: state.test.docUrl,
      testType: state.test.testType,
      testletConfig: state.test.testletConfig,
      freeFormNotes: state?.test?.freeFormNotes,
      testletState: get(state, `testUserWork[${state.test ? state.test.testActivityId : ""}].testletState`, {}),
      annotations: state.test.annotations,
      pageStructure: state.test.pageStructure,
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
      gotoItem: gotoItemAction
    }
  )
);

export default enhance(AssessmentContainer);
