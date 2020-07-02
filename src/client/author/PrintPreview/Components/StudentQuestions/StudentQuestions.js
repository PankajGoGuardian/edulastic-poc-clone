import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { keyBy as _keyBy, get } from "lodash";
import queryString from "query-string";
import { questionType } from "@edulastic/constants";
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { getRows } from "../../../sharedDucks/itemDetail";
import { QuestionDiv, Content } from "./styled";
import { formatQuestionLists } from "../../../PrintAssessment/utils";

const defaultManualGradedType = questionType.manuallyGradableQn;

function Preview({ item, passages, evaluation }) {
  const rows = getRows(item);
  const questions = get(item, ["data", "questions"], []);
  const resources = get(item, ["data", "resources"], []);
  let questionsKeyed = { ..._keyBy(questions, "id"), ..._keyBy(resources, "id") };
  if (item.passageId && passages.length) {
    const passage = passages.find(p => p._id === item.passageId) || {};
    questionsKeyed = { ...questionsKeyed, ..._keyBy(passage.data, "id") };
  }

  const { itemLevelScoring, isPassageWithQuestions, multipartItem } = item;
  return (
    <Content key={item._id}>
      <TestItemPreview
        showFeedback
        cols={rows}
        preview="show"
        previewTab="show"
        questions={questionsKeyed}
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
        style={{ width: "100%" }}
        isPrintPreview
        evaluation={evaluation}
        isPassageWithQuestions={isPassageWithQuestions}
        itemLevelScoring={itemLevelScoring}
        multipartItem={multipartItem}
      />
    </Content>
  );
}

Preview.propTypes = {
  item: PropTypes.object.isRequired
};

class StudentQuestions extends Component {
  getTestItems() {
    const { currentStudent, questionActivities, location } = this.props;
    const { type, qs } = queryString.parse(location.search);
    // convert query string to array format
    const formattedFilteredQs = formatQuestionLists(qs);
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
      let filterQuestions = data.questions;
      // if search type passed as 'custom' in window location
      if (type === "custom") {
        filterQuestions = filterQuestions.filter(({ qLabel }) => formattedFilteredQs.includes(qLabel));
        // if item is passage type and match the question label, then consider all questions
        if (item.passageId && filterQuestions.length) {
          filterQuestions = data.questions;
        }
      }
      const questions = filterQuestions.map(question => {
        const { id } = question;
        let qIndex = 0;
        let qActivities = questionActivities.filter(({ qid }) => qid === id);
        qActivities = qActivities.map(q => {
          const userQuestion = userQActivities.find(({ _id }) => _id === q.qid);
          if (userQuestion) {
            q.qIndex = ++qIndex;
            q.timespent = userQuestion.timespent;
            q.studentName = currentStudent !== undefined ? currentStudent.studentName : null;
          }
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

    // Case Passage question type: if item don't have question, then hide the passage content also
    testItems = testItems.filter(ti => !!ti.data?.questions?.length);

    // If search type is 'manualGraded', then accept manual graded items only
    if (type === "manualGraded") {
      testItems = testItems.reduce((acc, ti) => {
        let _qs = ti.data?.questions;
        if (ti.multipartItem || ti.itemLevelScoring) {
          _qs =
            _qs.filter(q => defaultManualGradedType.includes(q.type) || q.validation?.automarkable === false).length > 0
              ? _qs
              : [];
        } else {
          _qs = _qs.filter(q => defaultManualGradedType.includes(q.type) || q.validation?.automarkable === false);
        }
        if (_qs.length) {
          ti.data.questions = _qs;
          return [...acc, ti];
        }
        return [...acc];
      }, []);
    }

    // merge items belongs to same passage
    testItems = testItems.reduce((acc, item) => {
      if (item.passageId && acc.length) {
        acc.forEach(i => {
          if (i.passageId === item.passageId) {
            item.passageId = null;
          }
        });
      }
      return [...acc, item];
    }, []);
    return [...testItems];
  }

  render() {
    const testItems = this.getTestItems();
    const { classResponse, questionActivities } = this.props;
    const { passages = [] } = classResponse;
    const evaluationStatus = questionActivities.reduce((acc, curr) => {
      if (curr.pendingEvaluation) {
        acc[curr.qid] = "pending";
      } else {
        acc[curr.qid] = curr.evaluation;
      }

      return acc;
    }, {});

    const testItemsRender = testItems.map((item, i) => (
      <div className={i !== 0 && "__print-question-main-wrapper"}><Preview item={item} passages={passages} evaluation={evaluationStatus} /></div>
    ));
    return <QuestionDiv>{testItemsRender}</QuestionDiv>;
  }
}

export default withRouter(StudentQuestions);

StudentQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  currentStudent: PropTypes.object.isRequired
};
