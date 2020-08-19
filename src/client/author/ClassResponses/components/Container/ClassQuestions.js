/* eslint-disable react/prop-types */
import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import { keyBy as _keyBy, isEmpty, get } from "lodash";
// components
import { AnswerContext } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import produce from "immer";
import { Modal, Row, Col } from "antd";
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { loadScratchPadAction, clearUserWorkAction } from "../../../../assessment/actions/userWork";

import AssessmentPlayerModal from "../../../Assignments/components/Container/TestPreviewModal";
import { getRows } from "../../../sharedDucks/itemDetail";
// styled wrappers
import { StyledFlexContainer } from "./styled";
import { getDynamicVariablesSetIdForViewResponse } from "../../../ClassBoard/ducks";
import Worksheet from "../../../AssessmentPage/components/Worksheet/Worksheet";
import { ThemeButton } from "../../../src/components/common/ThemeButton";

function Preview({
  item,
  qIndex,
  studentId,
  studentName,
  evaluation,
  showStudentWork,
  passages,
  isQuestionView,
  isExpressGrader,
  isLCBView,
  questionActivity,
  scratchpadProps,
  userWork,
  t
}) {
  const rows = getRows(item, false);
  const questions = get(item, ["data", "questions"], []);
  const resources = get(item, ["data", "resources"], []);
  let questionsKeyed = { ..._keyBy(questions, "id"), ..._keyBy(resources, "id") };
  let passage = {};
  if (item.passageId && passages.length) {
    passage = passages.find(p => p._id === item.passageId) || {};
    questionsKeyed = { ...questionsKeyed, ..._keyBy(passage.data, "id") };
    rows[0] = passage.structure;
  }
  const passageId = passage?._id;
  const answerContextConfig = useContext(AnswerContext);
  const showScratchpadByDefault =
    questionActivity && questionActivity.qType === "highlightImage" && questionActivity.scratchPad?.scratchpad === true;

  const viewAtStudentRes = showScratchpadByDefault;
  const target = isExpressGrader || isQuestionView ? "_id" : "qActId";
  const history = showScratchpadByDefault ? userWork[questionActivity[target]] : {};
  const previouscratchPadDimensions = showScratchpadByDefault ? questionActivity.scratchPad.dimensions : null;
  const timeSpent = showScratchpadByDefault ? (questionActivity.timeSpent / 1000).toFixed(1) : null;

  const { multipartItem, itemLevelScoring, isPassageWithQuestions } = item;
  const scoringProps = { multipartItem, itemLevelScoring, isPassageWithQuestions };
  const attachments = get(questionActivity, "scratchPad.attachments", null);

  return (
    <StyledFlexContainer
      key={item._id}
      data-cy="student-question-container"
      className={`student-question-container-id-${studentId}`}
    >
      <TestItemPreview
        showCollapseBtn
        showFeedback
        cols={rows}
        isDocBased={item.isDocBased}
        preview="show"
        previewTab="show"
        questions={questionsKeyed}
        disableResponse={!answerContextConfig.isAnswerModifiable}
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
        style={{ width: "100%" }}
        qIndex={qIndex}
        evaluation={evaluation}
        showStudentWork={showStudentWork}
        passageTestItemID={passageId}
        isQuestionView={isQuestionView}
        isExpressGrader={isExpressGrader}
        isLCBView={isLCBView}
        showScratchpadByDefault={showScratchpadByDefault}
        viewAtStudentRes={viewAtStudentRes}
        timeSpent={timeSpent}
        attachments={attachments}
        {...scratchpadProps}
        previouscratchPadDimensions={previouscratchPadDimensions}
        history={history}
        saveHistory={() => {}}
        {...scoringProps}
        studentId={studentId}
        studentName={studentName || t("common.anonymous")}
        inLCB
        itemId={item._id}
      />
    </StyledFlexContainer>
  );
}

Preview.propTypes = {
  item: PropTypes.object.isRequired,
  qIndex: PropTypes.number.isRequired,
  studentId: PropTypes.any.isRequired,
  evaluation: PropTypes.object
};
Preview.defaultProps = {
  evaluation: {}
};

class ClassQuestions extends Component {
  state = {
    showPlayerModal: false,
    selectedTestItem: [],
    showDocBasedPlayer: false
  };

  static contextType = AnswerContext;

  // show AssessmentPlayerModal
  showPlayerModal = () => {
    this.setState({
      showPlayerModal: true
    });
  };

  getStudentName = () => {
    const { isPresentationMode, currentStudent } = this.props;
    if (!currentStudent) return null;
    const name = isPresentationMode ? currentStudent.fakeName : currentStudent.studentName;
    return name;
  };

  getTestItems() {
    const {
      currentStudent,
      questionActivities,
      studentViewFilter: filter,
      labels = {},
      isQuestionView = false,
      testItemsData,
      testActivityId,
      passages
    } = this.props;
    if (!currentStudent || !questionActivities) {
      return [];
    }

    let {
      classResponse: { testItems }
    } = this.props;

    const { variableSetIds } = this.props;

    const { expressGrader } = this.context;
    if (!expressGrader && testItems && !isQuestionView) {
      testItems = testItemsData.filter(tid => testItems.find(ti => ti._id === tid._id));
    }
    const userQActivities =
      currentStudent && currentStudent.questionActivities ? currentStudent.questionActivities : [];
    if (!testItems) {
      return [];
    }

    const { testItemsOrder = {} } = this.props;
    testItems = testItems
      .sort((x, y) => testItemsOrder[x._id] - testItemsOrder[y._id])
      .map(item => {
        const { data, rows, ...others } = item;
        if (!(data && !isEmpty(data.questions))) {
          return;
        }
        if (item.itemLevelScoring) {
          const firstQid = data.questions[0].id;
          const firstQAct = userQActivities.find(x => x._id === firstQid);
          if (firstQAct) {
            if (filter === "correct" && firstQAct.maxScore !== firstQAct.score) {
              return false;
            }

            if (filter === "wrong" && (firstQAct.score > 0 || firstQAct.skipped || firstQAct.graded === false)) {
              return false;
            }

            if (filter === "partial" && !(firstQAct.score > 0 && firstQAct.score < firstQAct.maxScore)) {
              return false;
            }
            if (filter === "skipped" && !(firstQAct.skipped && firstQAct.score === 0)) {
              return false;
            }
            if (filter === "notGraded" && !(firstQAct.graded === false)) {
              return false;
            }
          }
        }

        let questions = data.questions
          .map(question => {
            const { id } = question;
            let qActivities = questionActivities.filter(({ qid, id: altId }) => qid === id || altId === id);
            if (qActivities.length > 1) {
              /**
               * taking latest qActivity for a qid
               */
              const qActivity = qActivities.find(o => o.testActivityId === testActivityId);
              if (qActivity) {
                qActivities = [qActivity];
              } else {
                qActivities = [qActivities[qActivities.length - 1]];
              }
            }
            qActivities = qActivities.map(q => ({
              ...q,
              studentName: this.getStudentName(),
              icon: currentStudent.icon,
              color: currentStudent.color
            }));
            const label = labels[id];
            if (!item.itemLevelScoring && qActivities[0]) {
              if (filter === "correct" && qActivities[0].score < qActivities[0].maxScore) {
                return false;
              }

              if (
                filter === "wrong" &&
                (qActivities[0].score > 0 || qActivities[0].skipped || qActivities[0].graded === false)
              ) {
                return false;
              }

              if (filter === "skipped" && !(qActivities[0].skipped && qActivities[0].score === 0)) {
                return false;
              }
              if (filter === "notGraded" && !(qActivities[0].graded === false)) {
                return false;
              }
              if (
                filter === "partial" &&
                !(qActivities[0].score > 0 && qActivities[0].score < qActivities[0].maxScore)
              ) {
                return false;
              }
            }
            qActivities = qActivities.map(q => {
              const userQuestion = userQActivities.find(({ _id }) => _id === q.qid);
              if (userQuestion) {
                q.timespent = userQuestion.timeSpent;
                q.disabled = userQuestion.disabled;
              }

              return { ...q };
            });
            if (qActivities.length > 0) {
              [question.activity] = qActivities;
            } else {
              question.activity = undefined;
            }
            return { ...question, ...label };
          })
          .filter(x => x);
        if (!questions.length) {
          return false;
        }
        if (item.passageId && passages) {
          const passage = passages.find(p => p._id === item.passageId);
          if (passage) {
            questions = [...questions, passage.data?.[0]];
          }
        }
        const resources = data.resources || [];
        questions = [...questions, ...resources];
        return { ...others, rows, data: { questions } };
      })
      .filter(x => x);
    return this.transformTestItemsForAlgoVariables([...testItems], variableSetIds);
  }

  showStudentWork = testItem => {
    this.setState({
      showPlayerModal: true,
      selectedTestItem: testItem
    });
  };

  hideStudentWork = () => {
    const { closeTestletPlayer, showTestletPlayer } = this.props;
    this.setState(
      {
        showPlayerModal: false,
        selectedTestItem: []
      },
      () => {
        if (showTestletPlayer && closeTestletPlayer) {
          closeTestletPlayer();
        }
      }
    );
  };

  transformTestItemsForAlgoVariables = (testItems, variablesSetIds) =>
    produce(testItems, draft => {
      if (!draft) {
        return;
      }

      const qidSetIds = _keyBy(variablesSetIds, "qid");
      for (const [idxItem, item] of draft.entries()) {
        if (!item.algoVariablesEnabled) {
          continue;
        }
        const questions = get(item, "data.questions", []);
        for (const [idxQuestion, question] of questions.entries()) {
          const qid = question.id;
          const setIds = qidSetIds[qid];
          if (!setIds) {
            continue;
          }
          const setKeyId = setIds.setId;
          const examples = get(question, "variable.examples", []);
          const variables = get(question, "variable.variables", {});
          const example = examples.find(x => x.key === +setKeyId);
          if (!example) {
            continue;
          }
          for (const variable of Object.keys(variables)) {
            draft[idxItem].data.questions[idxQuestion].variable.variables[variable].exampleValue = example[variable];
          }
        }
      }
    });

  render() {
    const { showPlayerModal, selectedTestItem, showDocBasedPlayer } = this.state;
    const {
      questionActivities,
      currentStudent,
      passages = [],
      showTestletPlayer,
      classResponse,
      testActivity,
      userWork,
      isQuestionView,
      isLCBView,
      testItemsData,
      testData,
      qIndex,
      scratchpadProps,
      testActivityId,
      isPresentationMode,
      t
    } = this.props;
    const testItems = this.getTestItems();
    const { expressGrader: isExpressGrader = false } = this.context;

    const evaluationStatus = questionActivities.reduce((acc, curr) => {
      if (curr.pendingEvaluation) {
        acc[curr.qid] = "pending";
      } else {
        acc[curr.qid] = curr.evaluation;
      }

      return acc;
    }, {});

    const testItemsPreview = testItems.map((item, index) => {
      let showStudentWork = null;
      let scractchPadUsed = userWork[item._id];

      scractchPadUsed = item.data.questions.some(question => question?.activity?.scratchPad?.scratchpad);
      if (scractchPadUsed) {
        showStudentWork = () => this.showStudentWork(item);
      }
      if (testData.isDocBased) {
        showStudentWork = () => this.setState({ showDocBasedPlayer: true });
      }
      const questionActivity = questionActivities.find(act => act.testItemId === item._id);
      return (
        <Preview
          studentId={(currentStudent || {}).studentId}
          studentName={(currentStudent || {})[isPresentationMode ? "fakeName" : "studentName"]}
          key={index}
          item={item}
          passages={passages}
          qIndex={qIndex || index}
          evaluation={evaluationStatus}
          showStudentWork={showStudentWork}
          isQuestionView={isQuestionView}
          isExpressGrader={isExpressGrader}
          isLCBView={isLCBView}
          questionActivity={questionActivity}
          scratchpadProps={scratchpadProps}
          userWork={userWork}
          t={t}
        />
      );
    });
    const test = showTestletPlayer
      ? {
          testType: classResponse.testType,
          title: classResponse.title,
          testletConfig: classResponse.testletConfig,
          testletState: get(testActivity, "userWork.testletState"),
          itemGroups: [{ items: [selectedTestItem] }]
        }
      : { itemGroups: [{ items: [selectedTestItem] }] };

    let docBasedProps = {};
    if (testData.isDocBased) {
      const { isDocBased, docUrl, annotations, pageStructure, freeFormNotes = {} } = testData;
      const questionActivitiesById = _keyBy(questionActivities, "qid");

      const questions = (testItemsData?.[0]?.data?.questions || []).map(q => ({
        ...q,
        activity: questionActivitiesById[q.id]
      }));
      const questionsById = _keyBy(questions, "id");
      const studentWorkAnswersById = questionActivities.reduce((acc, cur) => {
        acc[cur.qid] = cur.userResponse;
        return acc;
      }, {});
      docBasedProps = {
        test: testData,
        review: true,
        viewMode: "report",
        isDocBased,
        docUrl,
        annotations,
        pageStructure,
        freeFormNotes,
        questionsById,
        questions,
        studentWorkAnswersById
      };
    }

    return (
      <>
        <AssessmentPlayerModal
          isModalVisible={showPlayerModal || showTestletPlayer}
          closeTestPreviewModal={this.hideStudentWork}
          test={test}
          isShowStudentWork
          isStudentReport
          LCBPreviewModal
          questionActivities={questionActivities}
          testActivityId={testActivityId || currentStudent.testActivityId}
        />
        {testData.isDocBased ? (
          <StyledModal
            visible={showDocBasedPlayer}
            onCancel={() => this.setState({ showDocBasedPlayer: false })}
            footer={null}
          >
            <Row className="exit-btn-row">
              <Col>
                <ThemeButton
                  onClick={() => this.setState({ showDocBasedPlayer: false })}
                  style={{ color: "#fff", width: "110px", marginLeft: "auto", marginRight: 20 }}
                >
                  Exit
                </ThemeButton>
              </Col>
            </Row>
            <Worksheet {...docBasedProps} studentWork />
          </StyledModal>
        ) : null}
        {testItemsPreview}
      </>
    );
  }
}

const withConnect = connect(
  (state, ownProps) => ({
    testItemsData: get(state, ["author_classboard_testActivity", "data", "testItemsData"], []),
    testData: get(state, ["author_classboard_testActivity", "data", "test"]),
    passages: get(state, ["author_classboard_testActivity", "data", "passageData"], []),
    variableSetIds: getDynamicVariablesSetIdForViewResponse(state, ownProps.currentStudent.studentId),
    userWork: get(state, ["userWork", "present"], {}),
    scratchpadProps: state.scratchpad
  }),
  {
    loadScratchPad: loadScratchPadAction,
    clearUserWork: clearUserWorkAction
  }
);

export default compose(
  withConnect,
  withNamespaces("student")
)(ClassQuestions);

ClassQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  currentStudent: PropTypes.object.isRequired,
  testItemsOrder: PropTypes.any.isRequired,
  labels: PropTypes.array.isRequired,
  qIndex: PropTypes.number,
  isPresentationMode: PropTypes.bool,
  studentViewFilter: PropTypes.string,
  showTestletPlayer: PropTypes.bool
};
ClassQuestions.defaultProps = {
  qIndex: null,
  isPresentationMode: false,
  showTestletPlayer: false,
  studentViewFilter: null
};

const StyledModal = styled(Modal)`
  width: 100% !important;
  top: 0 !important;
  left: 0 !important;

  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-header {
    display: none;
  }
  .ant-modal-content {
    height: 100vh;
    padding-top: 20px;
    bottom: auto;
    border-radius: 0;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    & > div:not(.ant-spin) {
      & > svg {
        height: 100%;
      }
    }
  }

  .exit-btn-row {
    margin-top: -10px;
    margin-bottom: 10px;
  }
`;
