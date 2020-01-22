/* eslint-disable react/prop-types */
import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import { keyBy as _keyBy, isEmpty, get } from "lodash";
// components
import { AnswerContext } from "@edulastic/common";
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { loadScratchPadAction } from "../../../../assessment/actions/userWork";

import AssessmentPlayerModal from "../../../Assignments/components/Container/TestPreviewModal";
import { getRows } from "../../../sharedDucks/itemDetail";
// styled wrappers
import { StyledFlexContainer } from "./styled";
import { getDynamicVariablesSetIdForViewResponse } from "../../../ClassBoard/ducks";
import produce from "immer";
import { Modal, Row, Col } from "antd";
import Worksheet from "../../../AssessmentPage/components/Worksheet/Worksheet";
import { ThemeButton } from "../../../src/components/common/ThemeButton";

function Preview({ item, qIndex, studentId, evaluation, showStudentWork, passages }) {
  const rows = getRows(item, false);
  const questions = get(item, ["data", "questions"], []);
  const resources = get(item, ["data", "resources"], []);
  let questionsKeyed = { ..._keyBy(questions, "id"), ..._keyBy(resources, "id") };
  if (item.passageId && passages.length) {
    const passage = passages.find(p => p._id === item.passageId) || {};
    questionsKeyed = { ...questionsKeyed, ..._keyBy(passage.data, "id") };
    rows[0] = passage.structure;
  }
  const testItemID = passages?.[0]?.testItems?.[0] || ""; // pass testItemId in which passage was used
  const answerContextConfig = useContext(AnswerContext);
  return (
    <StyledFlexContainer key={item._id} className={`student-question-container-id-${studentId}`}>
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
        passageTestItemID={testItemID}
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

  componentDidMount() {
    this.loadScratchPadData();
  }

  componentDidUpdate(prevProps) {
    const { questionActivities } = this.props;
    if (prevProps.questionActivities !== questionActivities) {
      this.loadScratchPadData();
    }
  }

  loadScratchPadData = () => {
    const { loadScratchPad, questionActivities } = this.props;
    if (!isEmpty(questionActivities)) {
      const userWork = {};
      questionActivities.forEach(curr => {
        if (curr.scratchPad && !userWork[curr.testItemId]) {
          userWork[curr.testItemId] = curr.scratchPad;
        }
      });
      if (!isEmpty(userWork)) {
        loadScratchPad(userWork);
      }
    }
  };

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
      testActivityId
    } = this.props;
    if (!currentStudent || !questionActivities) {
      return [];
    }

    let {
      classResponse: { testItems },
      variableSetIds
    } = this.props;

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
    const { showPlayerModal, selectedTestItem } = this.state;
    const {
      questionActivities,
      currentStudent: _currentStudent,
      passages = [],
      showTestletPlayer,
      classResponse,
      testActivity
    } = this.props;
    const testItems = this.getTestItems();
    const userWork = {};
    const evaluationStatus = questionActivities.reduce((acc, curr) => {
      if (curr.pendingEvaluation) {
        acc[curr.qid] = "pending";
      } else {
        acc[curr.qid] = curr.evaluation;
      }
      // accumulating userwork also here to avoid an extra loops. ummm... another frugal
      // ride over the looops?
      //to indicate scratchpadData available
      if (curr.scratchPadPresent && !userWork[curr.testItemId]) {
        userWork[curr.testItemId] = {};
      } else if (curr.scratchPad && !userWork[curr.testItemId]) {
        userWork[curr.testItemId] = curr.scratchPad;
      }
      return acc;
    }, {});

    const { qIndex, currentStudent, testData } = this.props;

    const testItemsPreview = testItems.map((item, index) => {
      let showStudentWork = userWork[item._id] ? () => this.showStudentWork(item) : null;
      if (testData.isDocBased) {
        showStudentWork = () => this.setState({ showDocBasedPlayer: true });
      }
      return (
        <Preview
          studentId={(currentStudent || {}).studentId}
          key={index}
          item={item}
          passages={passages}
          qIndex={qIndex || index}
          evaluation={evaluationStatus}
          showStudentWork={showStudentWork}
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

      const questions = (this.props.testItemsData?.[0]?.data?.questions || []).map(q => ({
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
        />
        {testData.isDocBased ? (
          <StyledModal
            visible={this.state.showDocBasedPlayer}
            onCancel={() => this.setState({ showDocBasedPlayer: false })}
            footer={null}
          >
            <Row>
              <Col span={2} offset={21}>
                <ThemeButton
                  onClick={() => this.setState({ showDocBasedPlayer: false })}
                  style={{ color: "#fff", width: "100%" }}
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

export default connect(
  (state, ownProps) => ({
    testItemsData: get(state, ["author_classboard_testActivity", "data", "testItemsData"], []),
    testData: get(state, ["author_classboard_testActivity", "data", "test"]),
    passages: get(state, ["author_classboard_testActivity", "data", "passageData"], []),
    variableSetIds: getDynamicVariablesSetIdForViewResponse(state, ownProps.currentStudent.studentId)
  }),
  {
    loadScratchPad: loadScratchPadAction
  }
)(ClassQuestions);

ClassQuestions.propTypes = {
  /**
   *
   */
  classResponse: PropTypes.object.isRequired,
  /**
   *
   */
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
  width: 98% !important;
  height: 98% !important;

  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-header {
    display: none;
  }
  .ant-modal-content {
    top: 10px;
    padding-top: 20px;
    bottom: auto;
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
`;
