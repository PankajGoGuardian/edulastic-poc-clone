/* eslint-disable react/prop-types */
import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { keyBy as _keyBy, isEmpty, get } from "lodash";
// components
import { AnswerContext } from "@edulastic/common";
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { loadScratchPadAction } from "../../../../assessment/actions/userWork.js";

import AssessmentPlayerModal from "../../../Assignments/components/Container/TestPreviewModal";
import { getRows } from "../../../sharedDucks/itemDetail";
// styled wrappers
import { StyledFlexContainer } from "./styled";

function Preview({ item, qIndex, studentId, evaluation, showStudentWork, passages }) {
  const rows = getRows(item);
  const questions = get(item, ["data", "questions"], []);
  const resources = get(item, ["data", "resources"], []);
  let questionsKeyed = { ..._keyBy(questions, "id"), ..._keyBy(resources, "id") };
  if (item.passageId && passages.length) {
    const passage = passages.find(p => p._id === item.passageId) || {};
    questionsKeyed = { ...questionsKeyed, ..._keyBy(passage.data, "id") };
  }

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
    selectedTestItem: []
  };

  static contextType = AnswerContext;

  componentDidUpdate(prevProps) {
    const { loadScratchPad, questionActivities } = this.props;
    if (prevProps.questionActivities !== questionActivities && !isEmpty(questionActivities)) {
      const userWork = {};
      questionActivities.forEach(curr => {
        if (curr.scratchPad && !userWork[curr.testItemId]) {
          userWork[curr.testItemId] = curr.scratchPad;
        }
      });

      loadScratchPad(userWork);
    }
  }

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
      isQuestionView = false
    } = this.props;
    if (!currentStudent || !questionActivities) {
      return [];
    }
    let {
      classResponse: { testItems }
    } = this.props;
    if (!this.context.expressGrader && testItems && !isQuestionView) {
      testItems = this.props.testItemsData.filter(tid => testItems.find(ti => ti._id === tid._id));
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
            if (filter === "wrong" && (firstQAct.score > 0 || firstQAct.skipped)) {
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
            let qActivities = questionActivities.filter(({ qid }) => qid === id);
            if (qActivities.length > 1) {
              /**
               * taking latest qActivity for a qid
               */
              qActivities = [qActivities[qActivities.length - 1]];
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
              if (filter === "wrong" && (qActivities[0].score > 0 || qActivities[0].skipped)) {
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
    return [...testItems];
  }

  showStudentWork = testItem => {
    this.setState({
      showPlayerModal: true,
      selectedTestItem: testItem
    });
  };

  hideStudentWork = () => {
    this.setState({
      showPlayerModal: false,
      selectedTestItem: []
    });
  };

  render() {
    const { showPlayerModal, selectedTestItem } = this.state;
    const { questionActivities, passages = [] } = this.props;
    const testItems = this.getTestItems();
    const userWork = {};

    const evaluation = questionActivities.reduce((acc, curr) => {
      acc[curr.qid] = curr.evaluation;
      // accumulating userwork also here to avoid an extra loops. ummm... another frugal
      // ride over the looops?
      if (curr.scratchPad && !userWork[curr.testItemId]) {
        userWork[curr.testItemId] = curr.scratchPad;
      }
      return acc;
    }, {});

    const { qIndex, currentStudent } = this.props;

    const testItemsPreview = testItems.map((item, index) => {
      const showStudentWork = userWork[item._id] ? () => this.showStudentWork(item) : null;
      return (
        <Preview
          studentId={(currentStudent || {}).studentId}
          key={index}
          item={item}
          passages={passages}
          qIndex={qIndex || index}
          evaluation={evaluation}
          showStudentWork={showStudentWork}
        />
      );
    });

    return (
      <>
        <AssessmentPlayerModal
          isModalVisible={showPlayerModal}
          closeTestPreviewModal={this.hideStudentWork}
          test={{ testItems: [selectedTestItem] }}
          LCBPreviewModal
        />
        {testItemsPreview}
      </>
    );
  }
}

export default connect(
  state => ({
    testItemsData: get(state, ["author_classboard_testActivity", "data", "testItemsData"], []),
    passages: get(state, ["author_classboard_testActivity", "data", "passageData"], [])
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
  studentViewFilter: PropTypes.string
};
ClassQuestions.defaultProps = {
  qIndex: null,
  isPresentationMode: false,
  studentViewFilter: null
};
