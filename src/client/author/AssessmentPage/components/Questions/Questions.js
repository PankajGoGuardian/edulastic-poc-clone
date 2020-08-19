/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import { findDOMNode } from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import uuid from "uuid/v4";
import PropTypes from "prop-types";
import { sortBy, maxBy, uniqBy } from "lodash";
import { SortableElement, sortableHandle, SortableContainer } from "react-sortable-hoc";
import PerfectScrollbar from "react-perfect-scrollbar";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT
} from "@edulastic/constants/const/questionType";
import { methods, defaultNumberPad } from "@edulastic/constants/const/math";

import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";
import { FaBars } from "react-icons/fa";
import { getPreviewSelector } from "../../../src/selectors/view";
import { checkAnswerAction } from "../../../src/actions/testItem";
import { changePreviewAction } from "../../../src/actions/view";
import { EXACT_MATCH } from "../../../../assessment/constants/constantsForQuestions";
import { addQuestionAction, updateQuestionAction, deleteQuestionAction } from "../../../sharedDucks/questions";
import AddQuestion from "../AddQuestion/AddQuestion";
import QuestionItem from "../QuestionItem/QuestionItem";
import QuestionEditModal from "../QuestionEditModal/QuestionEditModal";
import Section from "../Section/Section";
import {
  QuestionsWrapper,
  AnswerActionsWrapper,
  AnswerAction,
  StyledHandleSpan,
  QuestionWidgetWrapper
} from "./styled";
import { clearAnswersAction } from "../../../src/actions/answers";
import { deleteAnnotationAction } from "../../../TestPage/ducks";
import { getRecentStandardsListSelector } from "../../../src/selectors/dictionaries";
import { updateRecentStandardsAction } from "../../../src/actions/dictionaries";

const DragHandle = sortableHandle(() => (
  <StyledHandleSpan>
    <FaBars />
  </StyledHandleSpan>
));

const SortableQuestionItem = SortableElement(
  ({
    key,
    index,
    data,
    review,
    onCreateOptions,
    onOpenEdit,
    onDelete,
    previewMode,
    viewMode,
    answer,
    feedback,
    previousFeedback,
    onDragStart,
    highlighted,
    testMode,
    onHighlightQuestion,
    questionIndex,
    setCurrentAnnotationTool
  }) => (
    <div
      onClick={() => {
          setCurrentAnnotationTool('cursor');
          onHighlightQuestion(data.id);
        }}
      onFocus={() => {
          setCurrentAnnotationTool('cursor');
          onHighlightQuestion(data.id);
        }}
      style={{ display: "flex", marginBottom: "6px", padding: (testMode || review) && "0px 3px" }}
    >
      {!testMode && !review && <DragHandle review={review} />}
      <QuestionItem
        key={key}
        index={index}
        questionIndex={questionIndex}
        data={data}
        review={review}
        onCreateOptions={onCreateOptions}
        onOpenEdit={onOpenEdit}
        onDelete={onDelete}
        previewMode={previewMode}
        viewMode={viewMode}
        answer={answer}
        feedback={feedback}
        previousFeedback={previousFeedback}
        onDragStart={() => onDragStart(data.id)}
        highlighted={highlighted}
        testMode={testMode}
        setCurrentAnnotationTool={setCurrentAnnotationTool}
      />
    </div>
  )
);

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
  [TRUE_OR_FALSE]: [{ label: "TRUE", value: uuid() }, { label: "FALSE", value: uuid() }]
};

const mathData = {
  isMath: true,
  uiStyle: {
    type: "floating-keyboard"
  },
  numberPad: defaultNumberPad,
  symbols: ["basic", "units_si", "units_us"],
  template: ""
};

const multipleChoiceData = {
  uiStyle: { type: "horizontal" }
};

const clozeDropDownData = {
  responseIds: [{ index: 0, id: "0" }],
  stimulus: `<p><textdropdown id="0" contenteditable="false" /> </p>`
};

const essayData = {
  uiStyle: {
    numberOfRows: 10 // textarea number of rows
  },
  showWordCount: true
};

const trueOrFalseData = {
  type: "multipleChoice",
  subType: "trueOrFalse",
  uiStyle: { type: "horizontal" }
};

/**
 * SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT
 */

const typeTitleHash = {
  [SHORT_TEXT]: "Text Entry",
  [MULTIPLE_CHOICE]: "Multiple choice - standard",
  [CLOZE_DROP_DOWN]: "Cloze with Drop Down",
  [MATH]: "Math - standard",
  [TRUE_OR_FALSE]: "True or false",
  [ESSAY_PLAIN_TEXT]: "Essay with plain text"
};

const createQuestion = (type, index, isDocBased = false, docBasedCommonData = {}) => ({
  id: uuid(),
  qIndex: index,
  title: typeTitleHash[type],
  type,
  isDocBased,
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
  ...docBasedCommonData,
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
    highlighted: PropTypes.string
  };

  static defaultProps = {
    list: [],
    questionsById: {},
    noCheck: false,
    answersById: {},
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

  handleAddQuestion = (type, index, modalQuestionId, docBasedCommonData = {}) => () => {
    const { addQuestion, list, isDocBased = false } = this.props;
    const questions = list.filter(q => q.type !== "sectionLabel");

    const lastQuestion = questions[questions.length - 1];

    const questionIndex =
      index || (lastQuestion && lastQuestion.qIndex ? lastQuestion.qIndex + 1 : questions.length + 1);

    const question = createQuestion(type, questionIndex, isDocBased, docBasedCommonData);
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
    const { updateQuestion, updateRecentStandards } = this.props;
    let { recentStandardsList } = this.props;
    const question = this.currentQuestion;
    const nextQuestion = updateQuesionData(question, data);
    updateQuestion(nextQuestion);
    const { alignment = [] } = nextQuestion;

    const standards = alignment[0]?.standards || [];
    if (standards.length > 0 && data?.alignment) {
      // to update recent standards used in local storage and store
      recentStandardsList = uniqBy([...standards, ...recentStandardsList], i => i._id).slice(0, 10);
      updateRecentStandards({ recentStandards: recentStandardsList });
      storeInLocalStorage("recentStandards", JSON.stringify(recentStandardsList));
    }
  };

  handleOpenEditModal = index => direction => {
    let openIndex = index;
    if (direction === "next") {
      for (let i = index; i < this.questionList.length; i++) {
        if (!this.questionList[i]) {
          return this.handleCloseEditModal();
        }
        if (this.questionList[i].type === "sectionLabel" && i == this.questionList.length - 1) {
          return this.handleCloseEditModal();
        }
        if (this.questionList[i].type !== "sectionLabel") {
          openIndex = i;
          break;
        }
      }
    }
    if (direction === "back") {
      for (let i = index; i >= 0; i--) {
        if (!this.questionList[i]) {
          return this.handleCloseEditModal();
        }
        if (this.questionList[i].type === "sectionLabel" && i == 0) {
          return this.handleCloseEditModal();
        }
        if (this.questionList[i].type !== "sectionLabel") {
          openIndex = i;
          break;
        }
      }
    }
    this.setState({
      currentEditQuestionIndex: openIndex
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
    checkAnswer("show");
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

  getQIndexForDocBasedItems() {
    let loopVar = 1;
    return this.questionList.map(x => (x.type === "sectionLabel" ? null : loopVar++));
  }

  render() {
    const { currentEditQuestionIndex } = this.state;
    const {
      previewMode,
      viewMode,
      noCheck,
      answersById,
      highlighted,
      list,
      onDragStart,
      review,
      testMode,
      reportMode,
      onHighlightQuestion,
      setCurrentAnnotationTool
    } = this.props;
    const minAvailableQuestionIndex = (maxBy(list, "qIndex") || { qIndex: 0 }).qIndex + 1;
    let shouldModalBeVisibile = true;
    if (list.length > 0 && list[currentEditQuestionIndex]) {
      shouldModalBeVisibile = list[currentEditQuestionIndex].type !== "sectionLabel";
    }

    const questionIndex = this.getQIndexForDocBasedItems();

    return (
      <Fragment>
        <QuestionsWrapper
          reportMode={reportMode}
          review={review}
          viewMode={viewMode === "edit"}
          testMode={testMode}
          ref={this.containerRef}
        >
          <QuestionWidgetWrapper reportMode={reportMode} testMode={testMode} review={review}>
            <PerfectScrollbar>
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
                  <SortableQuestionItem
                    key={question.id}
                    index={i}
                    questionIndex={questionIndex[i]}
                    data={question}
                    review={review}
                    onCreateOptions={this.handleCreateOptions}
                    onOpenEdit={this.handleOpenEditModal(i)}
                    onDelete={this.handleDeleteQuestion(question.id)}
                    previewMode={previewMode}
                    viewMode={viewMode}
                    answer={answersById[question.id]}
                    onDragStart={onDragStart}
                    highlighted={highlighted === question.id}
                    testMode={testMode}
                    onHighlightQuestion={onHighlightQuestion}
                    setCurrentAnnotationTool={setCurrentAnnotationTool}
                  />
                )
              )}
            </PerfectScrollbar>
          </QuestionWidgetWrapper>
          {!review && !testMode && (
            <AddQuestion
              onAddQuestion={this.handleAddQuestion}
              onAddSection={this.handleAddSection}
              minAvailableQuestionIndex={minAvailableQuestionIndex}
              scrollToBottom={this.scrollToBottom}
            />
          )}
          {review && !noCheck && !reportMode && (
            <AnswerActionsWrapper>
              <AnswerAction active={previewMode === "check"} onClick={this.handleCheckAnswer}>
                Check Answer
              </AnswerAction>
              <AnswerAction active={previewMode === "show"} onClick={this.handleShowAnswer}>
                Show Answer
              </AnswerAction>
              <AnswerAction onClick={this.handleClear}>Clear</AnswerAction>
            </AnswerActionsWrapper>
          )}
        </QuestionsWrapper>
        {shouldModalBeVisibile && (
          <QuestionEditModal
            totalQuestions={list.length}
            visible={shouldModalBeVisibile}
            question={this.currentQuestion}
            qNumber={questionIndex[currentEditQuestionIndex]}
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
      recentStandardsList: getRecentStandardsListSelector(state),
      previewMode: getPreviewSelector(state)
    }),
    {
      addQuestion: addQuestionAction,
      updateQuestion: updateQuestionAction,
      deleteQuestion: deleteQuestionAction,
      deleteAnnotation: deleteAnnotationAction,
      updateRecentStandards: updateRecentStandardsAction,
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction,
      removeUserAnswer: clearAnswersAction
    }
  ),
  SortableContainer
);

export default enhance(Questions);
