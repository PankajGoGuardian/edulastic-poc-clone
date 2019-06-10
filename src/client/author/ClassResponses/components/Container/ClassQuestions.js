import React, { Component } from "react";
import PropTypes from "prop-types";
import { keyBy as _keyBy } from "lodash";
// components
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { getRows } from "../../../sharedDucks/itemDetail";
// styled wrappers
import { StyledFlexContainer } from "./styled";

function Preview({ item, qIndex, studentId }) {
  const rows = getRows(item);
  const questions = (item.data && item.data.questions) || [];
  const questionsKeyed = _keyBy(questions, "id");
  return (
    <StyledFlexContainer key={item._id} className={`student-question-container-id-${studentId}`}>
      <TestItemPreview
        showFeedback
        cols={rows}
        preview="show"
        previewTab="show"
        questions={questionsKeyed}
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
        style={{ width: "100%" }}
        qIndex={qIndex}
      />
    </StyledFlexContainer>
  );
}

Preview.propTypes = {
  item: PropTypes.object.isRequired,
  qIndex: PropTypes.number.isRequired
};

class ClassQuestions extends Component {
  getTestItems() {
    const { currentStudent, questionActivities, studentViewFilter: filter } = this.props;
    if (!currentStudent || !questionActivities) {
      return [];
    }
    let {
      classResponse: { testItems }
    } = this.props;
    let userQActivities = currentStudent && currentStudent.questionActivities ? currentStudent.questionActivities : [];
    if (!testItems) {
      return [];
    }

    const { testItemsOrder } = this.props;
    testItems = testItems
      .sort((x, y) => testItemsOrder[x._id] - testItemsOrder[y._id])
      .map(item => {
        const { data, rows, ...others } = item;
        if (!(data && data.questions)) {
          return;
        }
        if (item.itemLevelScoring) {
          const firstQid = data.questions[0].id;
          const firstQAct = userQActivities.find(x => x._id === firstQid);
          if (firstQAct) {
            if (filter === "correct" && firstQAct.maxScore != firstQAct.score) {
              return false;
            } else if (filter === "wrong" && firstQAct.score > 0) {
              return false;
            } else if (filter === "partial" && !(firstQAct.score > 0 && firstQAct.score < firstQAct.maxScore)) {
              return false;
            }
          }
        }
        const questions = data.questions
          .map(question => {
            const { id } = question;
            let qActivities = questionActivities.filter(({ qid }) => qid === id);
            if (!item.itemLevelScoring && qActivities[0]) {
              if (filter === "correct" && qActivities[0].score < qActivities[0].maxScore) {
                return false;
              } else if (filter === "wrong" && qActivities[0].score > 0) {
                return false;
              } else if (
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
                q.studentName = currentStudent !== undefined ? currentStudent.studentName : null;
              }
              q.studentName = currentStudent !== undefined ? currentStudent.studentName : null;
              return { ...q };
            });
            if (qActivities.length > 0) {
              [question.activity] = qActivities;
            } else {
              question.activity = undefined;
            }
            return { ...question };
          })
          .filter(x => x);
        return { ...others, rows, data: { questions } };
      })
      .filter(x => x);
    return [...testItems];
  }

  render() {
    const testItems = this.getTestItems();
    const { qIndex } = this.props;
    return testItems.map((item, index) => (
      <Preview
        studentId={(this.props.currentStudent || {}).studentId}
        key={index}
        item={item}
        qIndex={qIndex || index}
      />
    ));
  }
}

export default ClassQuestions;

ClassQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  currentStudent: PropTypes.object.isRequired,
  qIndex: PropTypes.number
};
ClassQuestions.defaultProps = {
  qIndex: null
};
