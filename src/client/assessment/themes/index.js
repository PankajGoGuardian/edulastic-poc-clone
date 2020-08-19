import React, { useEffect, useRef, useState, useMemo } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin, message, Modal, Button } from "antd";
import { isUndefined, get, isEmpty, isNull, isEqual, isObject } from "lodash";
import useInterval from "@use-it/interval";

import { test as testTypes, assignmentPolicyOptions, questionType } from "@edulastic/constants";
import { AssessmentPlayerContext, useRealtimeV2 } from "@edulastic/common";
import { themeColor } from "@edulastic/colors";

import { gotoItem as gotoItemAction, saveUserResponse } from "../actions/items";
import { finishTestAcitivityAction } from "../actions/test";
import { evaluateAnswer } from "../actions/evaluation";
import { changePreview as changePreviewAction } from "../actions/view";
import { getQuestionsByIdSelector } from "../selectors/questions";
import { testLoadingSelector, playerSkinTypeSelector } from "../selectors/test";
import { getAnswersArraySelector, getAnswersListSelector } from "../selectors/answers";
import AssessmentPlayerDefault from "./AssessmentPlayerDefault";
import AssessmentPlayerSimple from "./AssessmentPlayerSimple";
import AssessmentPlayerDocBased from "./AssessmentPlayerDocBased";
import AssessmentPlayerTestlet from "./AssessmentPlayerTestlet";
import { CHECK, CLEAR } from "../constants/constantsForQuestions";
import { updateTestPlayerAction } from "../../author/sharedDucks/testPlayer";
import { hideHintsAction } from "../actions/userInteractions";
import UnansweredPopup from "./common/UnansweredPopup";
import {
  regradedRealtimeAssignmentAction,
  clearRegradeAssignmentAction
} from "../../student/sharedDucks/AssignmentModule/ducks";
import { userWorkSelector } from "../../student/sharedDucks/TestItem";

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
    for (const widget of row?.widgets || []) {
      if (widget.widgetType === "question" && autoSavableTypes[widget.type]) {
        return true;
      }
    }
  }
  return false;
};

const RealTimeV2HookWrapper = ({ userId, testId, regradedAssignment, regradedRealtimeAssignment }) => {
  let topics = [`student_assessment:user:${userId}`, `student_assessment:test:${testId}`];
  if (regradedAssignment?.newTestId) {
    topics = [...topics, `student_assessment:test:${regradedAssignment?.newTestId}`];
  }
  useRealtimeV2(topics, {
    regradedAssignment: payload => regradedRealtimeAssignment(payload)
  });
  return null;
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
  regradedRealtimeAssignment,
  testId,
  userId,
  regradedAssignment,
  clearRegradeAssignment,
  ...restProps
}) => {
  const qid = preview || testletType ? 0 : match.params.qid || 0;
  const [currentItem, setCurrentItem] = useState(Number(qid));
  const [unansweredPopupSetting, setUnansweredPopupSetting] = useState({ qLabels: [], show: false });
  const [showRegradedModal, setShowRegradedModal] = useState(false);
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

  useEffect(() => {
    if (regradedAssignment && regradedAssignment?.newTestId !== testId) {
      setShowRegradedModal(true);
    }
  }, [regradedAssignment?.newTestId]);

  const onRegradedModalOk = () => {
    history.push(`/student/assessment/${regradedAssignment.newTestId}/class/${groupId}/uta/${restProps.utaId}/qid/0`);
    clearRegradeAssignment();
    setShowRegradedModal(false);
  };
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

  const hasUserWork = () => {
    const { userWork = {} } = restProps;
    const itemId = items[currentItem]?._id; // the id of current item shown during attempt
    if (!itemId) {
      // umm, something wrong with component, item id is empty, function should not evaluate
      return false;
    }
    const currentItemWork = { ...userWork?.[itemId] };
    /**
     * highlight image has scratchpad saved as false,
     * if assignment is resumed, but scratchpad was not used previously
     */
    if (currentItemWork.scratchpad !== undefined) {
      const scratchpadUsed = currentItemWork.scratchpad !== false;
      // delete the property so it does not contribute while checking isEmpty below
      delete currentItemWork.scratchpad;
      if (scratchpadUsed) {
        return true;
      }
    }

    return !isEmpty(currentItemWork);
  };

  const getUnAnsweredQuestions = () => {
    const questions = items[currentItem]?.data?.questions || [];
    /**
     * if user used scratchpad or other tools like cross out
     * consider item as attempted
     * @see https://snapwiz.atlassian.net/browse/EV-17309
     */
    if (hasUserWork()) {
      return [];
    }
    return questions.filter(q => {
      const qAnswers = answersById[q.id];
      switch (q.type) {
        case questionType.TOKEN_HIGHLIGHT:
          return (answersById[q.id] || []).filter(token => token?.selected).length === 0;
        case questionType.LINE_CHART:
        case questionType.BAR_CHART:
        case questionType.HISTOGRAM:
        case questionType.DOT_PLOT:
        case questionType.LINE_PLOT: {
          const initialData = q.chart_data.data;
          return initialData.every((d, i) => d.y === qAnswers[i].y);
        }
        case questionType.MATCH_LIST:
          return Object.values(qAnswers || {}).every(d => isNull(d));
        case questionType.SORT_LIST:
        case questionType.CLOZE_DRAG_DROP:
        case questionType.HOTSPOT:
          return !qAnswers?.some(ans => ans?.toString());
        case questionType.ORDER_LIST: {
          const prevOrder = [...Array(q.list.length).keys()];
          return qAnswers ? isEqual(prevOrder, qAnswers) : true;
        }
        case questionType.MATH:
          if (q.title === "Complete the Equation") {
            const ans = (qAnswers || "").replace(/\\ /g, "");
            return isEmpty(ans) || ans === "+=";
          }
          return isEmpty(qAnswers);
        case questionType.FORMULA_ESSAY:
          return (qAnswers || []).every(d => {
            const ans = (d.text || "").replace(/\\ /g, "");
            return isEmpty(ans);
          });
        case questionType.EXPRESSION_MULTIPART: {
          const { inputs = {}, dropDowns = {}, maths = {}, mathUnits = {} } = qAnswers || {};
          const isAnswered = Object.values({
            ...inputs,
            ...dropDowns,
            ...maths,
            ...mathUnits
          }).some(d => d.value?.trim() || d.unit);
          return !isAnswered;
        }
        case questionType.CLOZE_TEXT: {
          return (qAnswers || []).every(d => {
            if (typeof d === "string") {
              return isEmpty(d);
            }
            if (Array.isArray(d)) {
              return isEmpty(d || d?.value);
            }
            return isEmpty(d?.value);
          });
        }
        case questionType.CLASSIFICATION: {
          if (!isObject(qAnswers)) {
            return true;
          }
          const keys = Object.keys(qAnswers);
          return keys.length === 0 || keys.every(key => isEmpty(qAnswers[key]));
        }
        case questionType.CLOZE_IMAGE_DROP_DOWN:
        case questionType.CLOZE_IMAGE_TEXT: {
          if (!isObject(qAnswers)) {
            return true;
          }
          const keys = Object.keys(qAnswers);
          return keys.some(key => !qAnswers[key]);
        }
        default:
          return isEmpty(answersById[q.id]);
      }
    });
  };

  const onCloseUnansweedPopup = () => {
    setUnansweredPopupSetting({
      ...unansweredPopupSetting,
      show: false
    });
  };

  const gotoQuestion = (index, needsToProceed = false, context = "") => {
    if (preview) {
      hideHints();
      setCurrentItem(index);
    } else {
      const unansweredQs = getUnAnsweredQuestions();
      if ((unansweredQs.length && needsToProceed) || !unansweredQs.length || index < currentItem) {
        const previewTab = getPreviewTab(index);
        saveCurrentAnswer({
          urlToGo: `${url}/qid/${index}`,
          locState: history?.location?.state,
          callback: () => changePreview(previewTab)
        });
      } else {
        setUnansweredPopupSetting({
          show: true,
          qLabels: unansweredQs.map(({ barLabel, qSubLabel }) => `${barLabel.substr(1)}${qSubLabel}`),
          index,
          context
        });
      }
    }
  };

  const moveToNext = async (e, needsToProceed = false, value) => {
    if (!isLast() && value !== "SUBMIT") {
      gotoQuestion(Number(currentItem) + 1, needsToProceed, "next");
    }

    if (isLast() && preview && !demo) {
      closeTestPreviewModal();
    }

    if ((isLast() || value === "SUBMIT") && !preview) {
      const unansweredQs = getUnAnsweredQuestions();
      if ((unansweredQs.length && needsToProceed) || !unansweredQs.length) {
        const timeSpent = Date.now() - lastTime.current;
        await saveUserAnswer(currentItem, timeSpent, false, groupId, {
          urlToGo: `${url}/${"test-summary"}`,
          locState: { ...history?.location?.state, fromSummary: true }
        });
      } else {
        setUnansweredPopupSetting({
          show: true,
          qLabels: unansweredQs.map(({ barLabel, qSubLabel }) => `${barLabel.substr(1)}${qSubLabel}`),
          index: Number(currentItem) + 1,
          context: "next"
        });
      }
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
        saveUserAnswer(currentItem, timeSpent, false, groupId, {
          urlToGo: `${url}/${"test-summary"}`,
          locState: { ...history?.location?.state, fromSummary: true }
        });
      }
    } else {
      history.push(`/login`);
    }
  };

  const moveToPrev = (e, needsToProceed = false) => {
    if (!isFirst()) gotoQuestion(Number(currentItem) - 1, needsToProceed, "prev");
    if (enableMagnifier) {
      updateTestPlayer({ enableMagnifier: false });
    }
  };

  const onSkipUnansweredPopup = async () => {
    setUnansweredPopupSetting({
      ...unansweredPopupSetting,
      show: false
    });
    const { index, context } = unansweredPopupSetting;
    if (context === "next") {
      await moveToNext(null, true);
    } else if (context === "prev") {
      moveToPrev(null, true);
    } else {
      gotoQuestion(index, true);
    }
  };

  const testItem = items[currentItem] || {};
  let itemRows = testItem.rows;

  let passage = {};
  if (testItem.passageId && passages) {
    passage = passages.find(p => p._id === testItem.passageId);
    itemRows = [passage?.structure, ...itemRows];
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
    demo,
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

  let playerComponent = null;
  if (!isUndefined(docUrl)) {
    playerComponent = (
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
    playerComponent = (
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
    playerComponent = defaultAP ? <AssessmentPlayerDefault {...props} /> : <AssessmentPlayerSimple {...props} />;
  }

  return (
    <AssessmentPlayerContext.Provider value={{ isStudentAttempt: true }}>
      {showRegradedModal && (
        <Modal
          visible
          centered
          width={500}
          okButtonProps={{
            style: { background: themeColor }
          }}
          closable={false}
          footer={[
            <Button style={{ background: themeColor, color: "white" }} loading={loading} onClick={onRegradedModalOk}>
              Ok
            </Button>
          ]}
        >
          The assignment has been modified by Instructor. Please restart the assignment.
        </Modal>
      )}
      {unansweredPopupSetting.show && (
        <UnansweredPopup
          visible
          title=""
          onSkip={onSkipUnansweredPopup}
          onClose={onCloseUnansweedPopup}
          data={unansweredPopupSetting.qLabels}
        />
      )}
      {!preview && !demo && (
        <RealTimeV2HookWrapper
          userId={userId}
          testId={testId}
          regradedAssignment={regradedAssignment}
          regradedRealtimeAssignment={regradedRealtimeAssignment}
        />
      )}
      {playerComponent}
    </AssessmentPlayerContext.Provider>
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
    (state, ownProps) => ({
      view: state.view.preview,
      items: state.test.items,
      passages: state.test.passages || ownProps.passages,
      title: state.test.title,
      docUrl: state.test.docUrl,
      testType: state.test.testType,
      playerSkinType: playerSkinTypeSelector(state),
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
      enableMagnifier: state.testPlayer.enableMagnifier,
      regradedAssignment: get(state, "studentAssignment.regradedAssignment"),
      userId: get(state, "user.user._id"),
      userWork: userWorkSelector(state)
    }),
    {
      saveUserResponse,
      evaluateAnswer,
      changePreview: changePreviewAction,
      finishTest: finishTestAcitivityAction,
      gotoItem: gotoItemAction,
      updateTestPlayer: updateTestPlayerAction,
      hideHints: hideHintsAction,
      regradedRealtimeAssignment: regradedRealtimeAssignmentAction,
      clearRegradeAssignment: clearRegradeAssignmentAction
    }
  )
);

export default enhance(AssessmentContainer);
