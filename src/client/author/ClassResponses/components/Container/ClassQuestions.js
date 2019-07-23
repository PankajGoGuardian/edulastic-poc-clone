import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { keyBy as _keyBy, isEmpty } from "lodash";
// components
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { loadScratchPadAction } from "../../../../assessment/actions/userWork.js";

import AssessmentPlayerModal from "../../../Assignments/components/Container/TestPreviewModal";
import { getRows } from "../../../sharedDucks/itemDetail";
// styled wrappers
import { StyledFlexContainer } from "./styled";
import { AnswerContext } from "@edulastic/common";

function Preview({ item, qIndex, studentId, evaluation, showStudentWork }) {
  const rows = getRows(item);
  const questions = (item.data && item.data.questions) || [];
  const questionsKeyed = _keyBy(questions, "id");
  const answerContextConfig = useContext(AnswerContext);
  return (
    <StyledFlexContainer key={item._id} className={`student-question-container-id-${studentId}`}>
      <TestItemPreview
        showFeedback
        cols={rows}
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

  componentDidMount() {
    const { loadScratchPad, questionActivities } = this.props;
    const userWork = {};
    // load scratchpad data to store.
    questionActivities.forEach(curr => {
      if (curr.scratchPad && !userWork[curr.testItemId]) {
        userWork[curr.testItemId] = curr.scratchPad;
      }
    });

    loadScratchPad(userWork);
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
    const { currentStudent, questionActivities, studentViewFilter: filter, labels = {} } = this.props;
    if (!currentStudent || !questionActivities) {
      return [];
    }
    let {
      classResponse: { testItems }
    } = this.props;
    const userQActivities =
      currentStudent && currentStudent.questionActivities ? currentStudent.questionActivities : [];
    if (!testItems) {
      return [];
    }

    const { testItemsOrder } = this.props;
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
            if (filter === "wrong" && firstQAct.score > 0) {
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
              if (filter === "wrong" && qActivities[0].score > 0) {
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
        questions = [...questions, ...data.resources];
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

  render() {
    const { showPlayerModal, selectedTestItem } = this.state;
    const { questionActivities } = this.props;
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
      const showStudentWork = userWork[item._id] ? this.showStudentWork.bind(null, item) : null;
      return (
        <Preview
          studentId={(currentStudent || {}).studentId}
          key={index}
          item={item}
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
          hideModal={() => this.setState({ showPlayerModal: false })}
          test={{ testItems: [selectedTestItem] }}
          LCBPreviewModal
        />
        {testItemsPreview}
      </>
    );
  }
}

export default connect(
  null,
  {
    loadScratchPad: loadScratchPadAction
  }
)(ClassQuestions);

ClassQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
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
