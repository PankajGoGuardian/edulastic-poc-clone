/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { findDOMNode } from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import PropTypes from "prop-types";
import { sortBy, maxBy } from "lodash";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT
} from "@edulastic/constants/const/questionType";
import { methods } from "@edulastic/constants/const/math";

import { getPreviewSelector } from "../../../src/selectors/view";
import { checkAnswerAction } from "../../../src/actions/testItem";
import { changePreviewAction } from "../../../src/actions/view";
import { EXACT_MATCH } from "../../../../assessment/constants/constantsForQuestions";
import { addQuestionAction, updateQuestionAction, deleteQuestionAction } from "../../../sharedDucks/questions";
import AddQuestion from "../AddQuestion/AddQuestion";
import QuestionItem from "../QuestionItem/QuestionItem";
import QuestionEditModal from "../QuestionEditModal/QuestionEditModal";
import Section from "../Section/Section";
import { QuestionsWrapper, AnswerActionsWrapper, AnswerAction } from "./styled";
import { clearAnswersAction } from "../../../src/actions/answers";
import { deleteAnnotationAction } from "../../../TestPage/ducks";

const defaultQuestionValue = {
  [MULTIPLE_CHOICE]: [],
  [SHORT_TEXT]: "",
  [TRUE_OR_FALSE]: [],
  [CLOZE_DROP_DOWN]: [],
  [MATH]: [
    {
      method: methods.EQUIV_SYMBOLIC,
      options: {
        inverseResult: false,
        significantDecimalPlaces: 10
      },
      value: ""
    }
  ]
};

const defaultQuestionOptions = {
  [MULTIPLE_CHOICE]: [
    { label: "A", value: 1 },
    { label: "B", value: 2 },
    { label: "C", value: 3 },
    { label: "D", value: 4 }
  ],
  [CLOZE_DROP_DOWN]: {
    0: ["A", "B"]
  },
  [TRUE_OR_FALSE]: [{ label: "True", value: uuid() }, { label: "False", value: uuid() }]
};

const mathData = {
  isMath: true,
  uiStyle: {
    type: "floating-keyboard"
  },
  numberPad: [
    "7",
    "8",
    "9",
    "\\div",
    "4",
    "5",
    "6",
    "\\times",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    ",",
    "+",
    "left_move",
    "right_move",
    "Backspace",
    "="
  ],
  symbols: ["units_si", "units_us", "qwerty"],
  template: ""
};

const multipleChoiceData = {
  uiStyle: { type: "horizontal" }
};

const clozeDropDownData = {
  responseIds: [{ index: 0, id: "0" }],
  stimulus: `<p><textdropdown id="0" contenteditable="false" /> </p>`,
  title: "Cloze with Drop Down"
};
const essayData = {
  uiStyle: {
    minHeight: 15
  },
  showWordCount: true,
  title: "Essay with plain text"
};

const trueOrFalseData = {
  type: "multipleChoice",
  uiStyle: { type: "horizontal" },
  title: "True or false"
};
const createQuestion = (type, index) => ({
  id: uuid(),
  qIndex: index,
  title: `${type} - standard`,
  type,
  options: defaultQuestionOptions[type],
  validation: {
    scoringType: "exactMatch",
    validResponse: {
      score: 1,
      value: defaultQuestionValue[type]
    },
    altResponses: []
  },
  multipleResponses: false,
  stimulus: "",
  smallSize: true,
  alignment: [],
  ...(type === CLOZE_DROP_DOWN ? clozeDropDownData : {}),
  ...(type === TRUE_OR_FALSE ? trueOrFalseData : {}),
  ...(type === MULTIPLE_CHOICE ? multipleChoiceData : {}),
  ...(type === MATH ? mathData : {}),
  ...(type === ESSAY_PLAIN_TEXT ? essayData : {})
});

const createSection = (qIndex = 0, title = "") => ({
  id: uuid(),
  type: "sectionLabel",
  stimulus: "Section Label - Text",
  width: 0,
  height: 0,
  title,
  qIndex
});

const updateQuesionData = (question, data) => ({
  ...question,
  ...data
});

const updateMultipleChoice = optionsValue => {
  const options = optionsValue.split("");
  return {
    options: options.map((option, index) => ({
      label: option,
      value: index + 1
    })),
    validation: {
      scoringType: "exactMatch",
      validResponse: {
        score: 1,
        value: []
      },
      altResponses: []
    }
  };
};

const updateShortText = value => ({
  validation: {
    scoringType: EXACT_MATCH,
    validResponse: {
      score: 1,
      matchingRule: EXACT_MATCH,
      value
    },
    altResponses: []
  }
});

const validationCreators = {
  [MULTIPLE_CHOICE]: updateMultipleChoice,
  [SHORT_TEXT]: updateShortText
};

class Questions extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  static propTypes = {
    list: PropTypes.array,
    questionsById: PropTypes.object,
    addQuestion: PropTypes.func.isRequired,
    updateQuestion: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    changePreview: PropTypes.func.isRequired,
    previewMode: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
    noCheck: PropTypes.bool,
    answersById: PropTypes.object,
    centered: PropTypes.bool,
    highlighted: PropTypes.string
  };

  static defaultProps = {
    list: [],
    questionsById: {},
    noCheck: false,
    answersById: {},
    centered: false,
    highlighted: undefined
  };

  state = {
    currentEditQuestionIndex: -1
  };

  scrollToBottom = () => {
    const reference = this.containerRef;
    if (reference.current) {
      const elem = findDOMNode(reference.current);
      if (elem.scrollHeight > elem.clientHeight) {
        elem.scrollTop = elem.scrollHeight - elem.clientHeight;
      }
    }
  };

  handleAddQuestion = (type, index, modalQuestionId) => () => {
    const { addQuestion, list } = this.props;
    const questions = list.filter(q => q.type !== "sectionLabel");

    const lastQuestion = questions[questions.length - 1];

    const questionIndex =
      index || (lastQuestion && lastQuestion.qIndex ? lastQuestion.qIndex + 1 : questions.length + 1);

    const question = createQuestion(type, questionIndex);
    addQuestion(question);

    const questionIdToOpen = modalQuestionId - 1 || list.length;
    this.handleOpenEditModal(questionIdToOpen)();
  };

  handleDeleteQuestion = questionId => () => {
    const { deleteQuestion, deleteAnnotation } = this.props;
    deleteAnnotation(questionId);
    deleteQuestion(questionId);
  };

  handleAddSection = () => {
    const { addQuestion, list } = this.props;
    const sectionIndex = list.length;
    const section = createSection(sectionIndex);

    addQuestion(section);
    this.scrollToBottom();
  };

  handleUpdateSection = (sectionId, title) => {
    const { questionsById, updateQuestion } = this.props;
    const section = questionsById[sectionId];

    if (section) {
      const updatedSection = {
        ...section,
        title
      };
      updateQuestion(updatedSection);
    }
  };

  handleCreateOptions = (questionId, type) => ({ target: { value } }) => {
    const { questionsById, updateQuestion } = this.props;
    const question = questionsById[questionId];
    const createValidation = validationCreators[type];

    if (question) {
      const questionWithOptions = updateQuesionData(question, createValidation(value));

      updateQuestion(questionWithOptions);
    }
  };

  handleUpdateData = data => {
    const { updateQuestion } = this.props;
    const question = this.currentQuestion;

    const nextQuestion = updateQuesionData(question, data);

    updateQuestion(nextQuestion);
  };

  handleOpenEditModal = questionIndex => () => {
    const { currentEditQuestionIndex } = this.state;
    const nextQuestion = this.questionList[questionIndex];
    let nextIndex = questionIndex;

    const isNextQuestionSection = nextQuestion && nextQuestion.type === "sectionLabel";

    if (isNextQuestionSection) {
      const offset = questionIndex > currentEditQuestionIndex ? 1 : -1;
      nextIndex += offset;
    }

    this.setState({
      currentEditQuestionIndex: nextIndex
    });
  };

  handleCloseEditModal = () =>
    this.setState(
      {
        currentEditQuestionIndex: -1
      },
      () => this.scrollToBottom()
    );

  handleCheckAnswer = () => {
    const { checkAnswer, changePreview } = this.props;

    changePreview("check");
    checkAnswer("edit");
  };

  handleShowAnswer = () => {
    const { checkAnswer, changePreview } = this.props;

    changePreview("show");
    checkAnswer("edit");
  };

  handleClear = () => {
    const { changePreview, removeUserAnswer } = this.props;

    changePreview("clear");
    removeUserAnswer();
  };

  get currentQuestion() {
    const { currentEditQuestionIndex } = this.state;
    return this.questionList[currentEditQuestionIndex];
  }

  get editModalVisible() {
    const { currentEditQuestionIndex } = this.state;
    return currentEditQuestionIndex > -1;
  }

  get questionList() {
    const { list } = this.props;
    return sortBy(list, item => item.qIndex);
  }

  render() {
    const { currentEditQuestionIndex } = this.state;
    const { previewMode, viewMode, noCheck, answersById, centered, highlighted, list, onDragStart } = this.props;

    const review = viewMode === "review";

    const minAvailableQuestionIndex = (maxBy(list, "qIndex") || { qIndex: 0 }).qIndex + 1;
    let shouldModalBeVisibile = true;
    if (list.length > 0 && list[currentEditQuestionIndex]) {
      shouldModalBeVisibile = list[currentEditQuestionIndex].type !== "sectionLabel";
    }
    return (
      <Fragment>
        <QuestionsWrapper centered={centered} ref={this.containerRef}>
          <div>
            {this.questionList.map((question, i) =>
              question.type === "sectionLabel" ? (
                <Section
                  key={question.id}
                  section={question}
                  viewMode={viewMode}
                  onUpdate={this.handleUpdateSection}
                  onDelete={this.handleDeleteQuestion(question.id)}
                />
              ) : (
                <QuestionItem
                  key={question.id}
                  index={i}
                  data={question}
                  onCreateOptions={this.handleCreateOptions}
                  onOpenEdit={this.handleOpenEditModal(i)}
                  onDelete={this.handleDeleteQuestion(question.id)}
                  previewMode={previewMode}
                  viewMode={viewMode}
                  answer={answersById[question.id]}
                  centered={centered}
                  onDragStart={onDragStart}
                  highlighted={highlighted === question.id}
                />
              )
            )}
          </div>
          {!review && (
            <AddQuestion
              onAddQuestion={this.handleAddQuestion}
              onAddSection={this.handleAddSection}
              minAvailableQuestionIndex={minAvailableQuestionIndex}
              scrollToBottom={this.scrollToBottom}
            />
          )}
          {review && !noCheck && (
            <AnswerActionsWrapper>
              <AnswerAction active={previewMode === "check"} onClick={this.handleCheckAnswer}>
                Check Answer
              </AnswerAction>
              <AnswerAction active={previewMode === "show"} onClick={this.handleShowAnswer}>
                Show Answer
              </AnswerAction>
              <AnswerAction active={previewMode === "clear"} onClick={this.handleClear}>
                Clear
              </AnswerAction>
            </AnswerActionsWrapper>
          )}
        </QuestionsWrapper>
        {shouldModalBeVisibile && (
          <QuestionEditModal
            totalQuestions={list.length}
            visible={shouldModalBeVisibile}
            question={this.currentQuestion}
            index={currentEditQuestionIndex}
            onClose={this.handleCloseEditModal}
            onUpdate={this.handleUpdateData}
            onCurrentChange={this.handleOpenEditModal}
          />
        )}
      </Fragment>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      previewMode: getPreviewSelector(state)
    }),
    {
      addQuestion: addQuestionAction,
      updateQuestion: updateQuestionAction,
      deleteQuestion: deleteQuestionAction,
      deleteAnnotation: deleteAnnotationAction,
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction,
      removeUserAnswer: clearAnswersAction
    }
  )
);

export default enhance(Questions);
