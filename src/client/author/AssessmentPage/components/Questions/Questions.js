import React, { Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import PropTypes from "prop-types";
import { sortBy, maxBy } from "lodash";

import { SHORT_TEXT, MULTIPLE_CHOICE, CLOZE_DROP_DOWN, MATH } from "@edulastic/constants/const/questionType";
import { methods } from "@edulastic/constants/const/math";

import { getPreviewSelector, getViewSelector } from "../../../src/selectors/view";
import { checkAnswerAction } from "../../../src/actions/testItem";
import { changePreviewAction } from "../../../src/actions/view";
import { EXACT_MATCH } from "../../../../assessment/constants/constantsForQuestions";
import { addQuestionAction, updateQuestionAction, deleteQuestionAction } from "../../../sharedDucks/questions";
import AddQuestion from "../AddQuestion/AddQuestion";
import QuestionItem from "../QuestionItem/QuestionItem";
import QuestionEditModal from "../QuestionEditModal/QuestionEditModal";
import Section from "../Section/Section";
import { QuestionsWrapper, AnswerActionsWrapper, AnswerAction } from "./styled";

const defaultQuestionValue = {
  [MULTIPLE_CHOICE]: [],
  [SHORT_TEXT]: "",
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
  }
};

const mathData = {
  is_math: true,
  ui_style: {
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
  ui_style: { type: "horizontal" }
};

const createQuestion = (type, index) => ({
  id: uuid(),
  qIndex: index,
  title: `${type} - standart`,
  type,
  options: defaultQuestionOptions[type],
  validation: {
    scoring_type: "exactMatch",
    valid_response: {
      score: 1,
      value: defaultQuestionValue[type]
    },
    alt_responses: []
  },
  multiple_responses: false,
  stimulus: "",
  smallSize: true,
  alignment: [],
  ...(type === MULTIPLE_CHOICE ? multipleChoiceData : {}),
  ...(type === MATH ? mathData : {})
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
      scoring_type: "exactMatch",
      valid_response: {
        score: 1,
        value: []
      },
      alt_responses: []
    }
  };
};

const updateShortText = value => ({
  validation: {
    scoring_type: EXACT_MATCH,
    valid_response: {
      score: 1,
      matching_rule: EXACT_MATCH,
      value
    },
    alt_responses: []
  }
});

const validationCreators = {
  [MULTIPLE_CHOICE]: updateMultipleChoice,
  [SHORT_TEXT]: updateShortText
};

class Questions extends React.Component {
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

  componentDidUpdate(prevProps) {
    const { highlighted } = this.props;
    const { highlighted: prevHighlighted } = prevProps;

    if (highlighted && highlighted !== prevHighlighted) {
      const questionNode = document.getElementById(highlighted);

      if (questionNode) {
        questionNode.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  handleAddQuestion = (type, index, modalQuestionId) => () => {
    const { addQuestion, list } = this.props;
    const questions = list.filter(q => q.type !== "sectionLabel");

    const lastQuestion = questions[questions.length - 1];

    const questionIndex = index
      ? index
      : lastQuestion && lastQuestion.qIndex
      ? lastQuestion.qIndex + 1
      : questions.length + 1;

    const question = createQuestion(type, questionIndex);
    addQuestion(question);

    const questionIdToOpen = modalQuestionId - 1 || questions.length;

    this.handleOpenEditModal(questionIdToOpen)();
  };

  handleDeleteQuestion = questionId => () => {
    const { deleteQuestion } = this.props;
    deleteQuestion(questionId);
  };

  handleAddSection = () => {
    const { addQuestion, list } = this.props;
    const sectionIndex = list.length;
    const section = createSection(sectionIndex);

    addQuestion(section);
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
    this.setState({
      currentEditQuestionIndex: -1
    });

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
    const { previewMode, viewMode, noCheck, answersById, centered, highlighted, list } = this.props;

    const review = viewMode === "review";

    const minAvailableQuestionIndex = (maxBy(list, "qIndex") || { qIndex: 0 }).qIndex + 1;
    let shouldModalBeVisibile = true;
    if (list.length > 0 && list[currentEditQuestionIndex]) {
      shouldModalBeVisibile = list[currentEditQuestionIndex]["type"] !== "sectionLabel";
    }
    return (
      <Fragment>
        <QuestionsWrapper centered={centered}>
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
            </AnswerActionsWrapper>
          )}
        </QuestionsWrapper>
        {shouldModalBeVisibile && (
          <QuestionEditModal
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
      previewMode: getPreviewSelector(state),
      viewMode: getViewSelector(state)
    }),
    {
      addQuestion: addQuestionAction,
      updateQuestion: updateQuestionAction,
      deleteQuestion: deleteQuestionAction,
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction
    }
  )
);

export default enhance(Questions);
