import React, { useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled, { css, withTheme } from 'styled-components'
import { get, isEmpty, round } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import { questionType } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { greyThemeDark2 } from '@edulastic/colors'
import UnscoredBlock from '@edulastic/common/src/components/Unscored'

import { PrintPreviewScore } from './printPreviewScore'
import FeedBackContainer from './FeedBackContainer'
import FeedbackRight from './FeedbackRight'
import StudentReportFeedback from '../../student/TestAcitivityReport/components/StudentReportFeedback'
import { updateHeight as updateHeightAction } from '../../author/src/reducers/feedback'

const FeedbackWrapper = ({
  showFeedback,
  displayFeedback = false,
  isPrintPreview = false,
  showCollapseBtn,
  data,
  prevQActivityForQuestion = {},
  isStudentReport,
  isPresentationMode,
  dimensions,
  shouldTakeDimensionsFromStore,
  studentId,
  itemId,
  studentName,
  updatePosition,
  isExpressGrader,
  isQuestionView,
  t,
  hintsUsed,
  disableAllInputs = false,
}) => {
  const feedbackRef = useRef()
  const heightOfContainer = feedbackRef.current?.clientHeight
  useLayoutEffect(() => {
    if (!isStudentReport && shouldTakeDimensionsFromStore) {
      updatePosition({
        id: data.id,
        height: heightOfContainer,
      })
    }
  }, [feedbackRef.current, heightOfContainer])

  useEffect(() => {
    updatePosition({
      id: data.id,
      height: null,
    })
  }, [])

  const { rubrics: rubricDetails } = data
  const isPassageOrVideoType = [
    questionType.PASSAGE,
    questionType.VIDEO,
  ].includes(data.type)

  const { userResponse: previousUserResponse } = prevQActivityForQuestion || {}

  const { isPracticeQuestion = false } = data

  const studentReportFeedbackVisible =
    isStudentReport && !isPassageOrVideoType && !data.scoringDisabled
  const disabled = get(data, 'activity.disabled', false) || data.scoringDisabled
  const userId = get(data, 'activity.userId')
  const userName = get(data, 'activity.studentName')
  const presentationModeProps = {
    isPresentationMode,
    color: data.activity && data.activity.color,
    icon: data.activity && data.activity.icon,
  }

  const {
    score: prevScore,
    maxScore: prevMaxScore,
    feedback: prevFeedback,
    correct,
  } = prevQActivityForQuestion
  const timeSpent = get(data, 'activity.timeSpent', false)

  if (isPrintPreview && disabled) {
    return null
  }

  if (data.type == questionType.VIDEO || data.type == questionType.TEXT) {
    return null
  }
  return (
    <StyledFeedbackWrapper
      ref={feedbackRef}
      key={`feedback_${data.id}`}
      minWidth={
        studentReportFeedbackVisible && displayFeedback && !isPrintPreview
          ? '320px'
          : ''
      }
      shouldTakeDimensionsFromStore={shouldTakeDimensionsFromStore}
      dimensions={dimensions}
      className="__print-feedback-wrapper"
      isStudentReport={isStudentReport}
    >
      {showFeedback &&
        !isPassageOrVideoType &&
        displayFeedback &&
        !studentReportFeedbackVisible &&
        !isPrintPreview && (
          <FeedbackRight
            data-cy="feedBackRight"
            showCollapseBtn={showCollapseBtn}
            disabled={disabled}
            widget={data}
            studentId={userId || studentId}
            studentName={userName || studentName || t('common.anonymous')}
            rubricDetails={rubricDetails}
            disableAllInputs={disableAllInputs}
            isPracticeQuestion={isPracticeQuestion}
            itemId={itemId}
            isExpressGrader={isExpressGrader}
            isQuestionView={isQuestionView}
            isAbsolutePos={!isStudentReport && shouldTakeDimensionsFromStore}
            hintsUsed={hintsUsed}
            {...presentationModeProps}
          />
        )}
      {!isEmpty(prevQActivityForQuestion) &&
        displayFeedback &&
        !isPrintPreview && (
          <FeedBackContainer
            data-cy="feedBackContainer"
            correct={correct}
            prevScore={prevScore}
            prevMaxScore={prevMaxScore}
            prevFeedback={prevFeedback}
            previousUserResponse={previousUserResponse}
            qId={data.id}
          />
        )}
      {/* STUDENT REPORT PAGE FEEDBACK */}
      {studentReportFeedbackVisible && displayFeedback && !isPrintPreview && (
        <StudentReportFeedback
          isPracticeQuestion={isPracticeQuestion}
          qLabel={data.barLabel}
          qId={data.id}
          isStudentReport={isStudentReport}
        />
      )}

      {showFeedback &&
        isPrintPreview &&
        !disabled &&
        (isPracticeQuestion ? (
          <UnscoredBlock height="30px" />
        ) : (
          <PrintPreviewScore disabled={disabled} data={data} />
        ))}

      {isPrintPreview && !!timeSpent && showFeedback && !disabled && (
        <div className="__prevent-page-break __print-time-spent">
          <TimeSpentWrapper style={{ justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faClock} aria-hidden="true" />
            {round(timeSpent / 1000, 1)}s
          </TimeSpentWrapper>
        </div>
      )}
      {showFeedback && isPrintPreview && data?.activity?.feedback?.text && (
        <div data-cy="teacherFeedBack" className="print-preview-feedback">
          <div>Teacher Feedback: {data.activity.feedback.text}</div>
        </div>
      )}
    </StyledFeedbackWrapper>
  )
}

/**
 * as per https://snapwiz.atlassian.net/browse/EV-12821
 *
 * if its a multipart item, with item level scoring off
 * the container dimensions for the question block is stored in store
 * need to take the dimensions from store and set it to the feedback block
 */

const wrapperPosition = css`
  position: absolute;
  top: ${({ dimensions }) => dimensions.top}px;
  right: 0;
  width: 100%;
  height: ${({ dimensions }) =>
    dimensions.height ? `${dimensions.height}px` : '100%'};
`

const StyledFeedbackWrapper = styled.div`
  align-self: normal;
  min-width: ${({ minWidth }) => minWidth};
  ${({ shouldTakeDimensionsFromStore, dimensions, isStudentReport }) =>
    !isStudentReport &&
    shouldTakeDimensionsFromStore &&
    dimensions &&
    dimensions.top &&
    wrapperPosition};
`
const TimeSpentWrapper = styled.div`
  font-size: 19px;
  color: ${greyThemeDark2};
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  align-items: center;
  margin: ${({ margin }) => margin};
  &.student-report {
    position: absolute;
    top: 25px;
    right: 0px;
    background: #f3f3f3;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    svg {
      margin-right: 10px;
      fill: #6a737f;
    }
  }
  svg {
    margin-right: 8px;
    fill: ${greyThemeDark2};
  }
`

FeedbackWrapper.propTypes = {
  data: PropTypes.object,
  showFeedback: PropTypes.bool,
  displayFeedback: PropTypes.bool,
  isPrintPreview: PropTypes.bool.isRequired,
  showCollapseBtn: PropTypes.bool.isRequired,
  prevQActivityForQuestion: PropTypes.object.isRequired,
  isStudentReport: PropTypes.bool.isRequired,
  isPresentationMode: PropTypes.bool,
  t: PropTypes.func.isRequired,
  isQuestionView: PropTypes.bool,
}
FeedbackWrapper.defaultProps = {
  data: {},
  showFeedback: false,
  isPresentationMode: false,
  displayFeedback: true,
  isQuestionView: false,
}

const enhance = compose(
  withNamespaces('student'),
  withTheme,
  connect(
    (state, ownProps) => ({
      isPresentationMode: get(
        state,
        ['author_classboard_testActivity', 'presentationMode'],
        false
      ),
      dimensions: get(state, ['feedback', ownProps.data?.id], null),
    }),
    { updatePosition: updateHeightAction }
  )
)

export default enhance(FeedbackWrapper)
