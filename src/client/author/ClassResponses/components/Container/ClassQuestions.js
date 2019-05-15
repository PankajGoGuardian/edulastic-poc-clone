import React, { Component } from "react";
import PropTypes from "prop-types";
import { keyBy as _keyBy } from "lodash";
// components
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { getRows } from "../../../sharedDucks/itemDetail";
// styled wrappers
import { StyledFlexContainer } from "./styled";

function Preview({ item, qIndex }) {
  const rows = getRows(item);
  const questions = (item.data && item.data.questions) || [];
  const questionsKeyed = _keyBy(questions, "id");
  return (
    <StyledFlexContainer key={item._id}>
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
    const { currentStudent, questionActivities } = this.props;
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
    testItems = testItems.map(item => {
      const { data, rows, ...others } = item;
      if (!(data && data.questions)) {
        return;
      }
      const questions = data.questions.map(question => {
        const { id } = question;
        let qActivities = questionActivities.filter(({ qid }) => qid === id);
        qActivities = qActivities.map(q => {
          const userQuestion = userQActivities.find(({ _id }) => _id === q.qid);
          if (userQuestion) {
            q.timespent = userQuestion.timespent;
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
      });
      return { ...others, rows, data: { questions } };
    });
    return [...testItems];
  }

  render() {
    const testItems = this.getTestItems();
    const { qIndex } = this.props;
    return testItems.map((item, index) => <Preview key={index} item={item} qIndex={qIndex || index} />);
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
