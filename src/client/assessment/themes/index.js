import React, { useEffect, useRef, useState, useMemo } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin, message } from "antd";
import { isUndefined, get } from "lodash";
import { test as testTypes, assignmentPolicyOptions } from "@edulastic/constants";
import useInterval from "@use-it/interval";

import { gotoItem as gotoItemAction, saveUserResponse } from "../actions/items";
import { finishTestAcitivityAction } from "../actions/test";
import { evaluateAnswer } from "../actions/evaluation";
import { changePreview as changePreviewAction } from "../actions/view";
import { getQuestionsByIdSelector } from "../selectors/questions";
import { testLoadingSelector } from "../selectors/test";
import { getAnswersArraySelector, getAnswersListSelector } from "../selectors/answers";
import AssessmentPlayerDefault from "./AssessmentPlayerDefault";
import AssessmentPlayerSimple from "./AssessmentPlayerSimple";
import AssessmentPlayerDocBased from "./AssessmentPlayerDocBased";
import AssessmentPlayerTestlet from "./AssessmentPlayerTestlet";
import { CHECK, CLEAR } from "../constants/constantsForQuestions";
import { updateTestPlayerAction } from "../../author/sharedDucks/testPlayer";
import { hideHintsAction } from "../actions/userInteractions";

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
  showScratchPad,
  savingResponse,
  playerSkinType,
  userPrevAnswer,
  testSettings,
  showMagnifier,
  updateTestPlayer,
  enableMagnifier,
  studentReportModal,
  hideHints,
  demo,
  ...restProps
}) => {
  const qid = preview || testletType ? 0 : match.params.qid || 0;
  const [currentItem, setCurrentItem] = useState(Number(qid));
  const isLast = () => currentItem === items.length - 1;
  const isFirst = () => currentItem === 0;

  const lastTime = useRef(window.localStorage.assessmentLastTime || Date.now());

  // start assessment
  useEffect(() => {
    window.localStorage.assessmentLastTime = Date.now();
  }, []);

  useEffect(() => {
    lastTime.current = Date.now();
    window.localStorage.assessmentLastTime = lastTime.current;
    setCurrentItem(Number(qid));
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false });
    }
  }, [qid]);

  useEffect(() => {
    gotoItem(currentItem);
  }, [currentItem]);

  const saveCurrentAnswer = payload => {
    const timeSpent = Date.now() - lastTime.current;
    saveUserAnswer(currentItem, timeSpent, false, groupId, payload);
  };

  function getPreviewTab(index = currentItem) {
    let previewTab = CLEAR;
    const { showPreviousAttempt: redirectPolicy } = testSettings || {};
    const {
      showPreviousAttemptOptions: { STUDENT_RESPONSE_AND_FEEDBACK }
    } = assignmentPolicyOptions;

    if (redirectPolicy === STUDENT_RESPONSE_AND_FEEDBACK) {
      const questionIds = (items[index]?.data?.questions || []).map(question => question.id);
      const currentlyAnsweredQIds = Object.keys(answersById);
      const previouslyAnsweredQIds = Object.keys(userPrevAnswer);

      const renderCheckAnswerView =
        questionIds.length > 0 &&
        questionIds.some(id => previouslyAnsweredQIds.includes(id) && !currentlyAnsweredQIds.includes(id));

      if (renderCheckAnswerView) {
        previewTab = CHECK;
      }
    }

    return previewTab;
  }

  useEffect(() => {
    const previewTab = getPreviewTab();
    changePreview(previewTab);
  }, [userPrevAnswer, answersById, items]);

  const gotoQuestion = index => {
    if (preview) {
      hideHints();
      setCurrentItem(index);
    } else {
      const previewTab = getPreviewTab(index);
      saveCurrentAnswer({
        urlToGo: `${url}/qid/${index}`,
        locState: history?.location?.state,
        callback: () => changePreview(previewTab)
      });
    }
  };

  const moveToNext = async () => {
    if (!isLast()) {
      gotoQuestion(Number(currentItem) + 1);
    }

    if (isLast() && preview && !demo) {
      closeTestPreviewModal();
    }

    if (isLast() && !preview) {
      const timeSpent = Date.now() - lastTime.current;
      await saveUserAnswer(currentItem, timeSpent, false, groupId, {
        urlToGo: `${url}/${"test-summary"}`,
        locState: history?.location?.state
      });
    }
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false });
    }
  };

  const saveProgress = () => {
    const timeSpent = Date.now() - lastTime.current;
    saveUserAnswer(currentItem, timeSpent, false, groupId);
  };

  const gotoSummary = async () => {
    if (!preview) {
      if (!testletType) {
        const timeSpent = Date.now() - lastTime.current;
        await saveUserAnswer(currentItem, timeSpent, false, groupId);
      }
      history.push(`${url}/test-summary`);
    } else {
      history.push(`/login`);
    }
  };

  const moveToPrev = () => {
    if (!isFirst()) gotoQuestion(Number(currentItem) - 1);
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false });
    }
  };

  const testItem = items[currentItem] || {};
  let itemRows = testItem.rows;

  let passage = {};
  if (testItem.passageId && passages) {
    passage = passages.find(p => p._id === testItem.passageId);
    itemRows = [passage.structure, ...itemRows];
  }

  const autoSave = useMemo(() => shouldAutoSave(itemRows), [itemRows]);

  useInterval(() => {
    if (autoSave) {
      saveUserAnswer(currentItem, Date.now() - lastTime.current, true, groupId);
    }
  }, 1000 * 30);

  const handleMagnifier = () => updateTestPlayer({ enableMagnifier: !enableMagnifier });
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
    showScratchPad,
    passage,
    defaultAP,
    playerSkinType,
    showMagnifier,
    handleMagnifier,
    enableMagnifier,
    studentReportModal,
    ...restProps
  };

  useEffect(() => {
    if (savingResponse) {
      message.loading("submitting response", 0);
    } else {
      message.destroy();
    }
    return () => {
      /**
       * message might appear just during unmount.
       * in that case we need to destroy it after
       */
      setTimeout(() => message.destroy(), 1500);
    };
  }, [savingResponse]);

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
  } else if (testType === testTypes.type.TESTLET || test.testType === testTypes.type.TESTLET) {
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
  } else {
    /**
     * at student side only scratchPad should be enabled,
     * highlight image default pen should be disabled
     */
    return defaultAP ? <AssessmentPlayerDefault {...props} /> : <AssessmentPlayerSimple {...props} />;
  }
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
    (state, ownProps) => ({
      view: state.view.preview,
      items: state.test.items,
      passages: state.test.passages || ownProps.passages,
      title: state.test.title,
      docUrl: state.test.docUrl,
      testType: state.test.testType,
      playerSkinType: state.test.playerSkinType,
      testletConfig: state.test.testletConfig,
      freeFormNotes: state?.test?.freeFormNotes,
      testletState: get(state, `testUserWork[${state.test ? state.test.testActivityId : ""}].testletState`, {}),
      annotations: state.test.annotations,
      pageStructure: state.test.pageStructure,
      questionsById: getQuestionsByIdSelector(state),
      answers: getAnswersArraySelector(state),
      answersById: getAnswersListSelector(state),
      loading: testLoadingSelector(state),
      savingResponse: state?.test?.savingResponse,
      userPrevAnswer: state.previousAnswers,
      testSettings: state.test?.settings,
      showMagnifier: state.test.showMagnifier,
      enableMagnifier: state.testPlayer.enableMagnifier
    }),
    {
      saveUserResponse,
      evaluateAnswer,
      changePreview: changePreviewAction,
      finishTest: finishTestAcitivityAction,
      gotoItem: gotoItemAction,
      updateTestPlayer: updateTestPlayerAction,
      hideHints: hideHintsAction
    }
  )
);

export default enhance(AssessmentContainer);
