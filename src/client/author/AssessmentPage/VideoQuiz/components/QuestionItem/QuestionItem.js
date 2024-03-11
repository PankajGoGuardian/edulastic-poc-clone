import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  isArray,
  isUndefined,
  isNull,
  isEmpty,
  isObject,
  get,
  round,
} from 'lodash'
import { MathSpan, DragDrop, EduIf } from '@edulastic/common'
import { releaseGradeLabels } from '@edulastic/constants/const/test'

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT,
  AUDIO_RESPONSE,
} from '@edulastic/constants/const/questionType'
import {
  IconPencilEdit,
  IconCheck,
  IconClose,
  IconTrash,
} from '@edulastic/icons'
import { Col, Row } from 'antd'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FeedbackByQIdSelector } from '../../../../../student/sharedDucks/TestItem'
import withAnswerSave from '../../../../../assessment/components/HOC/withAnswerSave'
import { saveUserResponse as saveUserResponseAction } from '../../../../../assessment/actions/items'
import FormChoice from './components/FormChoice/FormChoice'
import FormText from './components/FormText/FormText'
import FormDropdown from './components/FormDropdown/FormDropdown'
import FormMath from './components/FormMath/FormMath'
import FormEssay from './components/FormEssay/FormEssay'
import DisplayTimestamp from './components/common/DisplayTimestamp'
import {
  QuestionItemWrapper,
  QuestionNumber,
  VideoQuizQuestionForm,
  EditButton,
  AnswerIndicator,
  DetailsContainer,
  DetailTitle,
  DetailContents,
  DetailContentsAlternate,
  ButtonWrapper,
  DetailAlternateContainer,
  StyledRemoveQuestion,
  VideoQuizItemWrapper,
  VideoQuizItemContainer,
  NextButton,
} from '../../styled-components/QuestionItem'
import FormAudio from './components/FormAudio/FormAudio'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../assessment/utils/timeUtils'
import DragHandle from '../DragHandle'

const { DragItem } = DragDrop

class QuestionItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dragging: false,
    }
  }

  itemRef = React.createRef()

  qFormRef = React.createRef()

  componentDidUpdate(prevProps) {
    const { highlighted } = this.props
    const { highlighted: prevHighlighted } = prevProps
    if (
      highlighted &&
      highlighted !== prevHighlighted &&
      this.itemRef.current
    ) {
      this.itemRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  handleDragStart = () => {
    const { onDragStart } = this.props
    this.setState({ dragging: true })
    if (onDragStart) {
      onDragStart()
    }
  }

  handleDragEnd = () => {
    this.setState({ dragging: false })
  }

  renderMultipleChoiceAnswer = (value, options) => {
    const labels = value.reduce((result, current) => {
      const option = options.find((o) => o.value === current)

      if (!option) return result

      return [...result, option.label]
    }, [])

    return labels.join(', ')
  }

  renderShortTextAnswer = (value) => (typeof value === 'string' ? value : '')

  renderDropDownAnswer = (value) => value?.[0]?.value && value[0].value

  renderMathAnswer = (value) => (
    <MathSpan
      dangerouslySetInnerHTML={{
        __html: `<span class="input__math" data-latex="${value?.[0]?.value}"></span>`,
      }}
    />
  )

  renderCorrectAnswer = () => {
    const {
      data: {
        type,
        validation: {
          validResponse: { value },
        },
        options,
      },
      evaluation,
      previewMode,
      data,
    } = this.props

    let allCorrect = isObject(evaluation)
      ? !isEmpty(evaluation) &&
        isArray(evaluation) &&
        evaluation.filter((v) => !isNull(v)).every((v) => v)
      : evaluation

    if (type === CLOZE_DROP_DOWN) {
      allCorrect = evaluation && evaluation['0']
    }

    if (type === ESSAY_PLAIN_TEXT) {
      return null
    }

    /**
     * if the preview is not in show answer mode and answer is correct ,
     * no need to show correct answer
     */
    if (previewMode !== 'show' && allCorrect) {
      return null
    }

    let answerRenderer

    switch (type) {
      case MULTIPLE_CHOICE:
      case TRUE_OR_FALSE:
        answerRenderer = this.renderMultipleChoiceAnswer
        break
      case SHORT_TEXT:
        answerRenderer = this.renderShortTextAnswer
        break
      case CLOZE_DROP_DOWN:
        answerRenderer = this.renderDropDownAnswer
        break
      case MATH:
        answerRenderer = this.renderMathAnswer
        break
      default:
        answerRenderer = () => {}
    }

    const alternateResponses = data?.validation?.altResponses || []
    let alternateResponsesDisplay = null
    if (alternateResponses.length > 0) {
      alternateResponsesDisplay = (
        <DetailAlternateContainer>
          <DetailTitle>Alternate Answers:</DetailTitle>
          {alternateResponses.map((res, i) => (
            <DetailContentsAlternate>
              {answerRenderer(
                res.value + (i === alternateResponses.length - 1 ? '' : ','),
                options
              )}
            </DetailContentsAlternate>
          ))}
        </DetailAlternateContainer>
      )
    }

    return (
      <DetailsContainer>
        <DetailTitle>Correct Answer:</DetailTitle>
        <DetailContents data-cy="correctAns">
          {answerRenderer(value, options)}
        </DetailContents>
        {alternateResponsesDisplay}
      </DetailsContainer>
    )
  }

  renderContent = (highlighted, boundingRect) => {
    let { evaluation } = this.props
    const {
      data,
      saveAnswer,
      viewMode,
      onCreateOptions,
      userAnswer,
      previewMode,
      saveUserResponse,
      groupId,
      qId,
      clearHighlighted,
      resetTimeSpentOnQuestion,
      itemId,
      disableAutoHightlight,
      isSnapQuizVideoPlayer = false,
    } = this.props

    if (!evaluation) {
      evaluation = data?.activity?.evaluation
    }

    const saveQuestionResponse = () => {
      if (qId >= 0 && groupId) {
        const timeSpent =
          Date.now() -
          parseInt(
            window.localStorage.getItem('docAssessmentLastTimestamp'),
            10
          )
        saveUserResponse(qId, timeSpent, false, groupId, {
          pausing: false,
          questionId: data.id,
        })
        if (resetTimeSpentOnQuestion) {
          resetTimeSpentOnQuestion()
        }
      }
    }

    const props = {
      saveAnswer,
      saveQuestionResponse,
      clearHighlighted,
      answer: userAnswer || data?.activity?.userResponse,
      question: data,
      mode: viewMode,
      view: previewMode,
      highlighted,
      boundingRect,
      testItemId: itemId,
      isSnapQuizVideoPlayer,
    }

    switch (data.type) {
      case MULTIPLE_CHOICE:
        return (
          <FormChoice
            isTrueOrFalse={data.subType === 'trueOrFalse'}
            onCreateOptions={onCreateOptions}
            evaluation={evaluation}
            {...props}
          />
        )
      case SHORT_TEXT:
        return (
          <FormText
            onCreateAnswer={onCreateOptions}
            {...props}
            disableAutoHightlight={disableAutoHightlight}
          />
        )
      case CLOZE_DROP_DOWN:
        return <FormDropdown {...props} />
      case MATH:
        return <FormMath {...props} />
      case ESSAY_PLAIN_TEXT:
        return (
          <FormEssay {...props} disableAutoHightlight={disableAutoHightlight} />
        )
      case TRUE_OR_FALSE:
        return (
          <FormChoice
            isTrueOrFalse
            onCreateOptions={onCreateOptions}
            evaluation={evaluation}
            {...props}
          />
        )
      case AUDIO_RESPONSE:
        return (
          <FormAudio
            onCreateAnswer={onCreateOptions}
            {...props}
            disableAutoHightlight={disableAutoHightlight}
          />
        )
      default:
        return null
    }
  }

  renderEditButton = () => {
    const { onOpenEdit, onDelete } = this.props
    return (
      <EditButton>
        <ButtonWrapper>
          <IconPencilEdit
            onClick={onOpenEdit}
            className="edit"
            title="Edit"
            data-cy="vqItemEditIcon"
          />
        </ButtonWrapper>
        <ButtonWrapper onClick={onDelete} inverse>
          <IconTrash
            title="Delete"
            className="delete"
            data-cy="vqItemDeleteIcon"
          />
        </ButtonWrapper>
      </EditButton>
    )
  }

  getIndicatorFromEvaluation = (evaluation) => {
    if (!isEmpty(evaluation)) {
      if (isArray(evaluation)) {
        return evaluation.every((value) => value)
      }
      return Object.values(evaluation).every((value) => value)
    }
    return false
  }

  renderAnswerIndicator = (type) => {
    let { evaluation } = this.props

    if (isUndefined(evaluation)) {
      evaluation = get(this.props, 'data.activity.evaluation')
    }

    if (isUndefined(evaluation) || type === ESSAY_PLAIN_TEXT) {
      return null
    }

    let correct = isObject(evaluation)
      ? this.getIndicatorFromEvaluation(evaluation)
      : evaluation

    if (type === CLOZE_DROP_DOWN) {
      correct = evaluation && evaluation['0']
    }
    return (
      <AnswerIndicator correct={correct} data-cy="answerIndicator">
        {correct ? <IconCheck /> : <IconClose />}
      </AnswerIndicator>
    )
  }

  renderComments = (qId) => {
    const { feedback = {}, previousFeedback } = this.props
    const { feedback: teacherComments } =
      previousFeedback?.find((pf) => pf.qid === qId) || feedback[qId] || {}

    return (
      !!teacherComments?.text && (
        <DetailsContainer>
          <DetailTitle>{teacherComments.teacherName}:</DetailTitle>
          <DetailContents data-cy="feedBack">
            {teacherComments.text}
          </DetailContents>
        </DetailsContainer>
      )
    )
  }

  renderScore = (qId) => {
    const { feedback = {}, previousFeedback = [], data } = this.props
    const maxScore = get(data, 'validation.validResponse.score', 0)
    const { feedback: teacherComments, graded, skipped } =
      previousFeedback.find((pf) => pf.qid === qId) ||
      feedback[qId] ||
      data.activity ||
      {}
    const score =
      previousFeedback.find((pf) => pf.qid === qId)?.score ||
      feedback[qId]?.score ||
      data.activity?.score ||
      0
    return (
      <>
        <DetailsContainer>
          <DetailTitle>Score:</DetailTitle>
          <DetailContents>
            {`${graded ? round(score, 2) : skipped ? 0 : ' '}/${round(
              maxScore,
              2
            )}`}
          </DetailContents>
        </DetailsContainer>
        {!!teacherComments?.text && (
          <DetailsContainer>
            <DetailTitle>{teacherComments.teacherName}:</DetailTitle>
            <DetailContents>{teacherComments.text}</DetailContents>
          </DetailsContainer>
        )}
      </>
    )
  }

  renderVideoQuizQuestionItem = ({ showAnswerIndicator }) => {
    const {
      data: { id, type = null, questionDisplayTimestamp = null } = {},
      questionIndex,
      review,
      viewMode,
      highlighted,
      testMode,
      pdfPreview,
      annotations,
      zoom,
      draggble,
      isSnapQuizVideoPlayer,
      editMode,
      handleOnClick,
    } = this.props

    return (
      <VideoQuizItemWrapper>
        <VideoQuizItemContainer>
          <EduIf condition={!testMode && !review}>
            <DragHandle review={review} questionIndex={questionIndex} />
          </EduIf>

          <QuestionNumber
            viewMode={viewMode === 'edit'}
            highlighted={highlighted}
            pdfPreview={pdfPreview}
            zoom={zoom}
            data-cy="questionNumber"
          >
            {questionIndex}
          </QuestionNumber>

          <EduIf condition={!annotations || draggble}>
            <VideoQuizQuestionForm
              id={`${
                isSnapQuizVideoPlayer ? 'video-player' : 'video-quiz'
              }-question-item-${id}`}
              review={review}
              ref={this.qFormRef}
              onClick={handleOnClick}
              isSnapQuizVideoPlayer={isSnapQuizVideoPlayer}
            >
              {this.renderContent(
                highlighted,
                this.qFormRef?.current?.getBoundingClientRect()
              )}
            </VideoQuizQuestionForm>
          </EduIf>
          <EduIf
            condition={
              !isSnapQuizVideoPlayer &&
              editMode &&
              typeof questionDisplayTimestamp === 'number'
            }
          >
            <DisplayTimestamp
              timestamp={getFormattedTimeInMinutesAndSeconds(
                questionDisplayTimestamp * 1000
              )}
            />
          </EduIf>
          {!review && !pdfPreview && !testMode && this.renderEditButton()}
        </VideoQuizItemContainer>
        {showAnswerIndicator && this.renderAnswerIndicator(type)}
      </VideoQuizItemWrapper>
    )
  }

  isQuestionHighlighted = (questionId) => {
    const { videoQuizQuestionsToDisplay = [], highlighted = false } = this.props
    if (videoQuizQuestionsToDisplay?.length) {
      const allQids = videoQuizQuestionsToDisplay.map(
        (annotation) => annotation?.questionId || ''
      )
      if (allQids?.length) {
        return highlighted || allQids.includes(questionId)
      }
      return highlighted
    }
    return highlighted
  }

  render() {
    const { data } = this.props

    if (!data?.id) {
      return null
    }
    const {
      data: { id } = {},
      review,
      viewMode,
      previewTab,
      previewMode,
      previousFeedback,
      answer,
      testMode,
      pdfPreview,
      annotations,
      reportActivity,
      draggble,
      editMode,
      handleRemoveAnnotation,
      isSnapQuizVideoPlayer = false,
      onPlay,
      questionIndex,
      highlighted,
    } = this.props

    const { dragging } = this.state

    const check =
      viewMode === 'report' ||
      previewTab === 'check' ||
      typeof previousFeedback?.[0]?.score !== 'undefined'

    const showAnswerIndicator =
      (review || testMode) &&
      !annotations &&
      (previewMode !== 'clear' || check) &&
      typeof answer !== 'undefined'

    const canShowAnswer = () => {
      if (reportActivity) {
        if (reportActivity?.releaseScore === releaseGradeLabels.WITH_ANSWERS) {
          return true
        }
      } else if (
        !pdfPreview &&
        review &&
        (previewMode === 'show' || viewMode === 'report')
      ) {
        return true
      }
    }

    const disableDrag = draggble ? false : review || testMode

    return (
      <DragItem
        data={{ id, index: questionIndex }}
        disabled={disableDrag}
        style={{ width: '100%', height: '100%' }}
      >
        <QuestionItemWrapper
          className={`doc-based-question-item-for-scroll-${id}`}
          id={id}
          highlighted={this.isQuestionHighlighted(id)}
          ref={this.itemRef}
          review={testMode || review}
          annotations={annotations}
          pdfPreview={pdfPreview}
          isSnapQuizVideoPlayer={isSnapQuizVideoPlayer}
          dragging={dragging}
          isEditMode={viewMode === 'edit'}
          data-cy="questionItem"
        >
          {this.renderVideoQuizQuestionItem({
            disableDrag,
            showAnswerIndicator,
          })}
          <EduIf
            condition={
              isSnapQuizVideoPlayer &&
              editMode &&
              typeof handleRemoveAnnotation === 'function'
            }
          >
            <StyledRemoveQuestion
              className="unselectable-text-container"
              onClick={() => handleRemoveAnnotation(id)}
            >
              <p>REMOVE QUESTION FROM VIDEO</p>
            </StyledRemoveQuestion>
          </EduIf>
          {canShowAnswer() && !annotations && this.renderCorrectAnswer()}
          {!pdfPreview &&
            (check ? this.renderScore(id) : this.renderComments(id))}
          <EduIf condition={!editMode && highlighted}>
            <Row type="flex" justify="end">
              <Col>
                <NextButton
                  size="small"
                  onClick={onPlay}
                  style={{ height: '30px' }}
                >
                  <FontAwesomeIcon
                    style={{ height: 15, width: 15 }}
                    icon={faPlayCircle}
                    data-cy="resumeIcon"
                  />{' '}
                  Resume
                </NextButton>
              </Col>
            </Row>
          </EduIf>
        </QuestionItemWrapper>
      </DragItem>
    )
  }
}

QuestionItem.propTypes = {
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
  answer: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  handleRemoveAnnotation: PropTypes.func,
  handleOnClick: PropTypes.func,
}

QuestionItem.defaultProps = {
  evaluation: undefined,
  userAnswer: undefined,
  answer: undefined,
  handleRemoveAnnotation: () => {},
  handleOnClick: () => {},
}

export default withAnswerSave(
  connect(
    (state) => ({
      previousFeedback: Object.values(state?.previousQuestionActivity || {})[0],
      feedback: FeedbackByQIdSelector(state),
      reportActivity: isEmpty(state.studentReport?.testActivity)
        ? false
        : state.studentReport?.testActivity,
    }),
    {
      saveUserResponse: saveUserResponseAction,
    }
  )(QuestionItem)
)
