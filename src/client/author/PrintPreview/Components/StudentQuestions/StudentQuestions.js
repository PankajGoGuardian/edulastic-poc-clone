import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { keyBy as _keyBy, get, groupBy } from "lodash";
import queryString from "query-string";
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import { getRows } from "../../../sharedDucks/itemDetail";
import { QuestionDiv, Content } from "./styled";
import { formatQuestionLists } from "../../../PrintAssessment/utils";
import { questionType } from "@edulastic/constants";

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
      />
    </Content>
  );
}

Preview.propTypes = {
  item: PropTypes.object.isRequired
};

class StudentQuestions extends Component {
  componentDidMount() {
    setTimeout(() => {
      const textAreas = ReactDOM.findDOMNode(this.printpreviewRef).getElementsByTagName("textarea");
      for (let i = 0; i < textAreas.length; i++) {
        let value = textAreas[i].value;
        let parent = textAreas[i].parentNode;
        $(parent).append("<div>" + value + "</div>");
      }
    }, 3000);
  }

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

    //Case Passage question type: if item don't have question, then hide the passage content also
    testItems = testItems.filter(ti => !!ti.data?.questions?.length);

    //If search type is 'manualGraded', then accept manual graded items only
    if (type === "manualGraded") {
      testItems = testItems.reduce((acc, ti) => {
        let qs = ti.data?.questions;
        if (ti.multipartItem || ti.itemLevelScoring) {
          qs =
            qs.filter(q => defaultManualGradedType.includes(q.type) || q.validation?.automarkable === false).length > 0
              ? qs
              : [];
        } else {
          qs = qs.filter(q => defaultManualGradedType.includes(q.type) || q.validation?.automarkable === false);
        }
        if (qs.length) {
          ti.data.questions = qs;
          return [...acc, ti];
        }
        return [...acc];
      }, []);
    }

    //merge items belongs to same passage
    testItems = testItems.reduce((acc, item) => {
      let isItemMatched = false;

      if (item.passageId && acc.length) {
        let modifiedItems = acc.map(i => {
          const cloneItem = { ...i };
          if (cloneItem.passageId === item.passageId) {
            //merge questions and resources
            cloneItem.data.questions = get(cloneItem, "data.questions", []).concat(get(item, "data.questions", []));
            cloneItem.data.resources = get(cloneItem, "data.resources", []).concat(get(item, "data.resources", []));

            //merge widgets of type 'question'
            cloneItem.rows = cloneItem.rows.map(row => {
              const cloneRow = { ...row };
              const isWidgetTypeRow = get(cloneRow, "widgets.[0].widgetType", "") === "question";
              if (isWidgetTypeRow) {
                const mergableItemRow = item.rows.filter(it => get(it, "widgets.[0].widgetType", "") === "question");
                cloneRow.widgets = [...cloneRow.widgets, ...get(mergableItemRow, "[0].widgets", [])];
              }
              return cloneRow;
            });
            isItemMatched = true;
          }
          return cloneItem;
        });
        if (!isItemMatched) {
          modifiedItems = [...modifiedItems, item];
        }
        return [...modifiedItems];
      }
      return [...acc, item];
    }, []);
    return [...testItems];
  }

  render() {
    const testItems = this.getTestItems();
    const { passages = [] } = this.props.classResponse;
    const evaluationStatus = this.props.questionActivities.reduce((acc, curr) => {
      if (curr.pendingEvaluation) {
        acc[curr.qid] = "pending";
      } else {
        acc[curr.qid] = curr.evaluation;
      }

      return acc;
    }, {});

    let testItemsRender = testItems.map(item => (
      <Preview item={item} passages={passages} evaluation={evaluationStatus} />
    ));
    return (
      <QuestionDiv
        ref={ref => {
          this.printpreviewRef = ref;
        }}
      >
        {testItemsRender}
      </QuestionDiv>
    );
  }
}

export default withRouter(StudentQuestions);

StudentQuestions.propTypes = {
  classResponse: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  currentStudent: PropTypes.object.isRequired
};
