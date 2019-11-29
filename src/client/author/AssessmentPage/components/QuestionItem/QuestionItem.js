/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-drag-and-drop";
import { connect } from "react-redux";
import { isArray, isUndefined, isNull, isEmpty, isObject, get } from "lodash";
import { MathSpan } from "@edulastic/common";
import { FeedbackByQIdSelector } from "../../../../student/sharedDucks/TestItem";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT
} from "@edulastic/constants/const/questionType";
import { IconPencilEdit, IconCheck, IconClose, IconTrash } from "@edulastic/icons";
import withAnswerSave from "../../../../assessment/components/HOC/withAnswerSave";
import FormChoice from "./components/FormChoice/FormChoice";
import FormText from "./components/FormText/FormText";
import FormDropdown from "./components/FormDropdown/FormDropdown";
import FormMath from "./components/FormMath/FormMath";
import FormEssay from "./components/FormEssay/FormEssay";
import {
  QuestionItemWrapper,
  QuestionNumber,
  QuestionForm,
  EditButton,
  AnswerForm,
  AnswerIndicator,
  DetailsContainer,
  DetailTitle,
  DetailContents,
  DetailContentsAlternate,
  ButtonWrapper
} from "./styled";

class QuestionItem extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    onCreateOptions: PropTypes.func.isRequired,
    onOpenEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    saveAnswer: PropTypes.func.isRequired,
    evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    userAnswer: PropTypes.any,
    previewMode: PropTypes.string.isRequired,
    viewMode: PropTypes.string.isRequired,
    highlighted: PropTypes.bool.isRequired,
    answer: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
  };

  static defaultProps = {
    evaluation: undefined,
    userAnswer: undefined,
    answer: undefined
  };

  state = {
    dragging: false
  };

  itemRef = React.createRef();

  componentDidUpdate(prevProps) {
    const { highlighted } = this.props;
    const { highlighted: prevHighlighted } = prevProps;
    if (highlighted && highlighted !== prevHighlighted && this.itemRef.current) {
      this.itemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  handleDragStart = () => {
    const { onDragStart } = this.props;
    this.setState({ dragging: true });
    if (onDragStart) {
      onDragStart();
    }
  };

  handleDragEnd = () => this.setState({ dragging: false });

  renderMultipleChoiceAnswer = (value, options) => {
    const labels = value.reduce((result, current) => {
      const option = options.find(o => o.value === current);

      if (!option) return result;

      return [...result, option.label];
    }, []);

    return labels.join(", ");
  };

  renderShortTextAnswer = value => value;

  renderDropDownAnswer = value => value[0].value;

  renderMathAnswer = value => (
    <MathSpan
      dangerouslySetInnerHTML={{ __html: `<span class="input__math" data-latex="${value[0].value}"></span>` }}
    />
  );

  renderCorrectAnswer = () => {
    const {
      data: {
        type,
        validation: {
          validResponse: { value }
        },
        options
      },
      evaluation,
      previewMode
    } = this.props;

    let allCorrect = isObject(evaluation)
      ? !isEmpty(evaluation) && isArray(evaluation) && evaluation.filter(v => !isNull(v)).every(v => v)
      : evaluation;

    if (type === CLOZE_DROP_DOWN) {
      allCorrect = evaluation && evaluation["0"];
    }

    if (type === ESSAY_PLAIN_TEXT) {
      return null;
    }

    /**
     * if the preview is not in show answer mode and answer is correct ,
     * no need to show correct answer
     */
    if (previewMode !== "show" && allCorrect) {
      return null;
    }

    let answerRenderer;

    switch (type) {
      case MULTIPLE_CHOICE:
      case TRUE_OR_FALSE:
        answerRenderer = this.renderMultipleChoiceAnswer;
        break;
      case SHORT_TEXT:
        answerRenderer = this.renderShortTextAnswer;
        break;
      case CLOZE_DROP_DOWN:
        answerRenderer = this.renderDropDownAnswer;
        break;
      case MATH:
        answerRenderer = this.renderMathAnswer;
        break;
      default:
        answerRenderer = () => {};
    }

    const alternateResponses = this.props?.data?.validation?.altResponses || [];
    let alternateResponsesDisplay = null;
    if (alternateResponses.length > 0) {
      alternateResponsesDisplay = (
        <div>
          <DetailTitle>Alternate Answers:</DetailTitle>
          {alternateResponses.map(res => (
            <DetailContentsAlternate>{answerRenderer(res.value, options)}</DetailContentsAlternate>
          ))}
        </div>
      );
    }
    return (
      <DetailsContainer>
        <DetailTitle>Correct Answer:</DetailTitle>
        <DetailContents>{answerRenderer(value, options)}</DetailContents>
        {alternateResponsesDisplay}
      </DetailsContainer>
    );
  };

  renderContent = () => {
    const { data, saveAnswer, viewMode, onCreateOptions, evaluation, userAnswer, previewMode } = this.props;
    const props = {
      saveAnswer,
      answer: userAnswer,
      question: data,
      mode: viewMode,
      view: previewMode
    };
    switch (data.type) {
      case MULTIPLE_CHOICE:
        return <FormChoice onCreateOptions={onCreateOptions} evaluation={evaluation} {...props} />;
      case SHORT_TEXT:
        return <FormText onCreateAnswer={onCreateOptions} {...props} />;
      case CLOZE_DROP_DOWN:
        return <FormDropdown {...props} />;
      case MATH:
        return <FormMath {...props} />;
      case ESSAY_PLAIN_TEXT:
        return <FormEssay {...props} />;
      case TRUE_OR_FALSE:
        return <FormChoice isTrueOrFalse onCreateOptions={onCreateOptions} evaluation={evaluation} {...props} />;
      default:
        return null;
    }
  };

  renderEditButton = () => {
    const { onOpenEdit, onDelete } = this.props;
    return (
      <EditButton>
        <ButtonWrapper>
          <IconPencilEdit onClick={onOpenEdit} title="Edit" />
        </ButtonWrapper>
        <ButtonWrapper>
          <IconTrash onClick={onDelete} title="Delete" />
        </ButtonWrapper>
      </EditButton>
    );
  };

  renderAnswerIndicator = type => {
    const { evaluation } = this.props;

    if (isUndefined(evaluation) || type === ESSAY_PLAIN_TEXT) {
      return null;
    }

    let correct = isObject(evaluation)
      ? !isEmpty(evaluation) && isArray(evaluation) && evaluation.every(value => value)
      : evaluation;

    if (type === CLOZE_DROP_DOWN) {
      correct = evaluation && evaluation["0"];
    }
    return <AnswerIndicator correct={correct}>{correct ? <IconCheck /> : <IconClose />}</AnswerIndicator>;
  };

  renderComments = qId => {
    const { feedback = {} } = this.props;
    const { feedback: teacherComments } =
      this.props?.previousFeedback?.find(pf => pf.qid === qId) || feedback[qId] || {};

    return (
      !!teacherComments?.text && (
        <DetailsContainer>
          <DetailTitle>{teacherComments.teacherName}:</DetailTitle>
          <DetailContents>{teacherComments.text}</DetailContents>
        </DetailsContainer>
      )
    );
  };

  renderScore = qId => {
    const { feedback = {}, previousFeedback = [], data } = this.props;
    const {
      score,
      maxScore = get(data, "validation.validResponse.score", 0),
      feedback: teacherComments,
      graded,
      skipped,
      ...rest
    } = previousFeedback.find(pf => pf.qid === qId) || feedback[qId] || {};

    return (
      <>
        <DetailsContainer>
          <DetailTitle>Score:</DetailTitle>
          <DetailContents>{`${graded ? score : skipped ? 0 : " "}/${maxScore}`}</DetailContents>
        </DetailsContainer>
        {!!teacherComments?.text && (
          <DetailsContainer>
            <DetailTitle>{teacherComments.teacherName}:</DetailTitle>
            <DetailContents>{teacherComments.text}</DetailContents>
          </DetailsContainer>
        )}
      </>
    );
  };

  render() {
    const { dragging } = this.state;
    const {
      data: { id, qIndex, type },
      index,
      review,
      viewMode,
      previewTab,
      previewMode,
      highlighted,
      previousFeedback,
      answer
    } = this.props;

    const check =
      viewMode === "report" || previewTab === "check" || typeof previousFeedback?.[0]?.score !== "undefined";

    return (
      <QuestionItemWrapper id={id} highlighted={highlighted} ref={this.itemRef}>
        <AnswerForm style={{ justifyContent: review ? "flex-start" : "space-between" }}>
          <Draggable
            type="question"
            data={JSON.stringify({ id, index: qIndex || index })}
            onDragStart={this.handleDragStart}
            onDragEnd={this.handleDragEnd}
            enabled={!review}
          >
            <QuestionNumber viewMode={viewMode === "edit"} dragging={dragging}>
              {qIndex || index + 1}
            </QuestionNumber>
          </Draggable>
          <QuestionForm review={review}>{this.renderContent()}</QuestionForm>
          {!review && this.renderEditButton()}
          {review &&
            (previewMode !== "clear" || check) &&
            typeof answer !== "undefined" &&
            this.renderAnswerIndicator(type)}
        </AnswerForm>
        {review && (previewMode === "show" || viewMode === "report") && this.renderCorrectAnswer()}
        {check ? this.renderScore(id) : this.renderComments(id)}
      </QuestionItemWrapper>
    );
  }
}

export default withAnswerSave(
  connect(state => ({
    previousFeedback: Object.values(state?.previousQuestionActivity || {})[0],
    feedback: FeedbackByQIdSelector(state)
  }))(QuestionItem)
);
