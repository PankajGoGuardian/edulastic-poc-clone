import {
  desktopWidth,
  mobileWidthMax,
  tabGrey,
  themeColor,
  themeColorTagsBg,
  white,
} from '@edulastic/colors'
import {
  AnswerContext,
  withWindowSizes,
  notification,
  EduButton,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Avatar, Card, Input } from 'antd'
import {
  get,
  isUndefined,
  maxBy,
  round,
  sumBy,
  toNumber,
  isNaN,
  isEmpty,
  isEqual,
} from 'lodash'
import PropTypes from 'prop-types'
import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
import * as Sentry from '@sentry/browser'
import UnScored from '@edulastic/common/src/components/Unscored'
import { setTeacherEditedScore as setTeacherEditedScoreAction } from '../../author/ExpressGrader/ducks'
import { updateStudentQuestionActivityScoreAction } from '../../author/sharedDucks/classResponses'
import { hasValidAnswers } from '../utils/answer'
import { receiveFeedbackResponseAction } from '../../author/src/actions/classBoard'
import {
  getErrorResponse,
  getStatus,
} from '../../author/src/selectors/feedback'
import {
  getUserSelector,
  getUserThumbnail,
  getUserFullNameSelector,
} from '../../author/src/selectors/user'
import { getAvatarName } from '../../author/ClassBoard/Transformer'
import RubricGrading from './RubricGrading'

const { TextArea } = Input

const adaptiveRound = (x) =>
  x && x.endsWith ? (x.endsWith('.') ? x : round(x, 2)) : round(x, 2)

function ScoreInputFocusEffectComponent({
  scoreInputRef,
  responseLoading,
  feedbackInputHasFocus,
}) {
  useEffect(() => {
    if (scoreInputRef.current && !responseLoading && !feedbackInputHasFocus) {
      scoreInputRef.current.focus()
    }
  }, [responseLoading])

  return null
}

const isInvalidScore = (score) => (!score || isNaN(score)) && score != 0

const InputType = {
  InputScore: 'inputScore',
  RubricsScore: 'rubricsScore',
}

class FeedbackRight extends Component {
  constructor(props) {
    super(props)

    let { maxScore } = props?.widget?.activity || {}
    let { score } = props?.widget?.activity || {}
    if (!maxScore) {
      maxScore = props?.widget?.validation?.validResponse?.score || 0
    }

    if (props?.isQuestionView && isEmpty(props?.widget?.activity)) {
      score = 0
    }

    this.state = {
      score,
      maxScore,
      showFeedbackSaveBtn: false,
      feedbackInputHasFocus: false,
      clearRubricFeedback: false,
      isRubricDisabled: false,
      isScoreInputDisabled: false,
      showWarningToClear: false,
    }

    this.scoreInput = React.createRef()
    this.feedbackInputRef = React.createRef()
    this.scoreRegex = new RegExp(/^[0-9]*(\.){0,1}([0-9]+)?$/)
  }

  static contextType = AnswerContext

  componentDidUpdate(prevProps) {
    const {
      studentQuestionResponseUpdatedAt: prevStudentQuestionResponseUpdatedAt,
      isClassResponseLoading: prevIsClassResponseLoading,
      classQuestionResponseData: prevClassQuestionResponseData,
    } = prevProps
    const {
      studentQuestionResponseUpdatedAt,
      isClassResponseLoading,
      classQuestionResponseData,
    } = this.props

    if (prevProps?.widget?.activity && !this.props?.widget?.activity) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ score: 0 })
    }
    if (
      prevProps?.widget?.activity?.score !== this.props?.widget?.activity?.score
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        changed: false,
      })
    }

    /**
     * Express grader, Question Centric, Student Centric
     * Enable inputs after score gets updated
     */
    if (
      prevStudentQuestionResponseUpdatedAt !==
        studentQuestionResponseUpdatedAt ||
      prevIsClassResponseLoading !== isClassResponseLoading ||
      !isEqual(prevClassQuestionResponseData, classQuestionResponseData)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isRubricDisabled: false,
        isScoreInputDisabled: false,
      })
    }
  }

  componentDidMount() {
    if (this.context?.expressGrader === true) {
      this.scoreInput?.current?.focus()
    }
  }

  static getDerivedStateFromProps(
    { widget: { activity, validation }, isQuestionView },
    preState
  ) {
    let newState = {}
    const { submitted, feedback, maxScore, changed, qActId: _qActId } =
      preState || {}
    if (submitted) {
      newState = {
        submitted: false,
        changed: false,
      }
    }

    if (activity && isUndefined(changed)) {
      let { score: _score, scoreByAI } = activity
      const { qActId, _id } = activity
      let { maxScore: _maxScore } = activity
      let _feedback = get(activity, 'feedback.text', '')
      const feedbackByAI = get(activity, 'feedbackByAI.text', '')
      const isTeacherEvaluationPresent = _score || !isEmpty(_feedback)
      const isAIEvaluationPresent = scoreByAI || !isEmpty(feedbackByAI)
      const showAIEvaluatedResult = [
        !isTeacherEvaluationPresent,
        isAIEvaluationPresent,
      ].every((o) => !!o)
      if (showAIEvaluatedResult) {
        _score = scoreByAI
      }
      if (showAIEvaluatedResult) {
        _feedback = feedbackByAI
      }
      newState = { ...newState, qActId: qActId || _id }

      if (isQuestionView && isEmpty(activity)) {
        _score = 0
      }

      if (!isInvalidScore(_score) || _qActId !== (qActId || _id)) {
        newState = { ...newState, score: _score }
      }

      if (!_maxScore) {
        _maxScore = validation?.validResponse?.score || 0
      }

      if (_maxScore !== maxScore) {
        newState = { ...newState, maxScore: _maxScore }
      }

      if (_feedback !== feedback) {
        newState = { ...newState, feedback: _feedback }
      }

      return newState
    }

    return newState
  }

  getTestActivityId() {
    const { studentId, classBoardData } = this.props
    const testActivity =
      classBoardData?.testActivities?.find((x) => x?.userId === studentId) || {}
    return testActivity._id
  }

  onScoreSubmit(rubricResponse) {
    const { score, maxScore } = this.state
    const { currentScreen } = this.context
    const {
      user,
      updateQuestionActivityScore,
      widget: { id, activity = {} },
      studentId,
      itemId,
      allAnswers = {},
      isExpressGrader,
    } = this.props

    if (isInvalidScore(score)) {
      notification({ type: 'warn', messageKey: 'scoreShouldNumber' })
      return
    }
    const _score = toNumber(score)
    if (_score > maxScore) {
      notification({ type: 'warn', messageKey: 'scoreShouldLess' })
      return
    }

    const {
      testActivityId,
      groupId = this.props?.match?.params?.classId,
      testItemId,
    } = activity

    if (!id || !user || !user.user) {
      return
    }

    const payload = {
      score: rubricResponse || { score: _score },
      testActivityId: testActivityId || this.getTestActivityId(),
      questionId: id,
      itemId: testItemId || itemId,
      groupId,
      studentId,
    }

    if (currentScreen === 'live_class_board') {
      payload.shouldReceiveStudentResponse = true
    }

    if (isExpressGrader) {
      payload.fromExpressGrader = true
    }

    if (payload.testActivityId && payload.itemId) {
      if (allAnswers[id]) {
        // adding user responses only when not empty
        if (hasValidAnswers(activity?.qType, allAnswers[id])) {
          payload.userResponse = { [id]: allAnswers[id] }
        } else {
          Sentry.configureScope((scope) => {
            scope.setExtra('qType', activity?.qType)
            scope.setExtra('userResponse', allAnswers[id])
            Sentry.captureMessage('empty response update event', 'info')
          })
        }
      }
      updateQuestionActivityScore(payload)
    }
  }

  onFeedbackSubmit() {
    const { feedback } = this.state
    const {
      user,
      studentId,
      loadFeedbackResponses,
      widget: { id, activity = {} },
      match,
      userThumbnail,
      itemId,
      userFullName,
      isQuestionView,
    } = this.props
    const {
      testActivityId,
      groupId = match?.params?.classId,
      testItemId,
    } = activity

    if (!id || !user || !user.user) {
      return
    }
    loadFeedbackResponses({
      body: {
        feedback: {
          teacherId: user.user._id,
          teacherName: userFullName,
          text: feedback,
          ...(userThumbnail ? { thumbnail: userThumbnail } : {}),
        },
        groupId,
      },
      studentId,
      testActivityId: testActivityId || this.getTestActivityId(),
      questionId: id,
      itemId: testItemId || itemId,
      isQuestionView,
    })
  }

  preCheckSubmit = () => {
    const { changed, showFeedbackSaveBtn } = this.state
    if (changed || showFeedbackSaveBtn) {
      this.onFeedbackSubmit()
    }
    this.setState({ showFeedbackSaveBtn: false })
  }

  allowToSubmitScore = (eventType) => {
    const { changed } = this.state
    /**
     * in case of student did not visit the question, allow teacher trying to grade first time
     * @see EV-25489
     */
    if (eventType !== 'blur') {
      return false
    }
    const { isQuestionView, widget: { activity = {} } = {} } = this.props
    if (isQuestionView) {
      return isEmpty(activity)
    }
    return activity.isDummy && changed
  }

  submitScore = (e) => {
    const { changed } = this.state
    const allowSubmitScore = this.allowToSubmitScore(e?.type)
    if (changed || allowSubmitScore) {
      this.onScoreSubmit()
    }
    this.setState({ showWarningToClear: false })
  }

  onChangeScore = (showGradingRubricButton) => (value, inputType) => {
    const isValid = this.scoreRegex.test(value)
    if ((isValid && !isNaN(value)) || value === '.') {
      this.setState({ score: value, changed: true })
    }
    // Clearing rubric feedback when changing score from input-box/rubrics
    if (showGradingRubricButton) {
      switch (inputType) {
        case InputType.InputScore:
          this.setState((prevState) => ({
            ...prevState,
            clearRubricFeedback: true,
            isRubricDisabled: true,
            showWarningToClear: false,
          }))
          break
        case InputType.RubricsScore:
          this.setState((prevState) => ({
            ...prevState,
            clearRubricFeedback: false,
            isScoreInputDisabled: true,
          }))
          break
        default:
          break
      }
    }
  }

  onChangeFeedback = (e) => {
    this.setState({
      changed: true,
      feedback: e.target.value,
      showFeedbackSaveBtn: !!e.target.value,
    })
  }

  enableScoreInput = () => {
    this.setState({ isScoreInputDisabled: false })
  }

  onKeyDownFeedback = ({ keyCode }) => {
    /**
     * arrow keys or escape key
     */
    if (this.context?.expressGrader && this.context?.studentResponseLoading) {
      return
    }
    if ((keyCode >= 37 && keyCode <= 40) || keyCode === 27) {
      this.preCheckSubmit()
      this.submitScore()
    }
  }

  focusScoreInput() {
    const { match } = this.props
    const { path } = match
    const { current } = this.scoreInput
    if (path.search('expressgrader') !== -1 && current) {
      current.focus()
    }
  }

  handleScoreInputFocus = () => {
    this.setState({ showWarningToClear: true })
  }

  handleRubricResponse = (res, isSubmit) => {
    this.setState({ score: res.score }, () => {
      if (isSubmit) {
        this.onScoreSubmit(res)
      }
    })
  }

  focusFeedbackInput = () => this.setState({ feedbackInputHasFocus: true })

  blurFeedbackInput = () =>
    this.setState({ feedbackInputHasFocus: false, isShowFeedbackInput: false })

  showFeedbackInput = () => {
    this.setState(
      { isShowFeedbackInput: true, feedbackInputHasFocus: true },
      () => {
        if (this.feedbackInputRef.current) {
          this.feedbackInputRef.current.focus()
        }
      }
    )
  }

  render() {
    const { studentResponseLoading, expressGrader } = this.context
    const {
      studentName,
      widget: { activity },
      isPresentationMode,
      color,
      icon,
      showCollapseBtn,
      rubricDetails,
      user,
      disabled,
      isPracticeQuestion,
      isAbsolutePos,
      hintsUsed,
    } = this.props
    const {
      score,
      maxScore,
      feedback,
      changed,
      showFeedbackSaveBtn,
      feedbackInputHasFocus,
      isShowFeedbackInput,
      clearRubricFeedback,
      isRubricDisabled,
      isScoreInputDisabled,
      showWarningToClear,
    } = this.state
    let rubricMaxScore = 0
    if (rubricDetails)
      rubricMaxScore = sumBy(
        rubricDetails.criteria,
        (c) => maxBy(c.ratings, 'points').points
      )
    let { rubricFeedback, rubricFeedbackByAI } = activity || {} // origin for rubric_Feedback
    if (isEmpty(rubricFeedback) && !isEmpty(rubricFeedbackByAI)) {
      rubricFeedback = rubricFeedbackByAI
    }
    const isStudentName = studentName !== undefined && studentName.length !== 0
    let title
    const showGradingRubricButton =
      user.user?.features?.gradingrubrics && !!rubricDetails

    if (isStudentName) {
      title = (
        <TitleDiv data-cy="studentName">
          {isPresentationMode ? (
            <i
              className={`fa fa-${icon}`}
              style={{ color, fontSize: '32px' }}
            />
          ) : (
            <UserAvatar>{getAvatarName(studentName)}</UserAvatar>
          )}
          &nbsp;
          {studentName}
        </TitleDiv>
      )
    } else {
      title = null
    }

    let _score = adaptiveRound(score || 0)
    if (
      (activity &&
        activity.graded === false &&
        (activity.score === 0 || isUndefined(activity.score)) &&
        !score &&
        !changed) ||
      (activity?.isDummy && expressGrader && !changed)
    ) {
      _score = ''
    }

    const _maxScore =
      showGradingRubricButton && rubricMaxScore ? rubricMaxScore : maxScore

    const isError = _maxScore < score
    // TODO: uncomment when practice question scoring is implemented (EV-12869)
    // if (isPracticeQuestion) {
    //   _maxScore = "";
    // }

    const showHintUsed = !isUndefined(hintsUsed)

    return (
      <StyledCardTwo
        data-cy="feedbackContainer"
        bordered={isStudentName}
        disabled={disabled}
        showCollapseBtn={showCollapseBtn}
        title={title}
      >
        {expressGrader && (
          <ScoreInputFocusEffectComponent
            scoreInputRef={this.scoreInput}
            feedbackInputHasFocus={feedbackInputHasFocus}
            responseLoading={studentResponseLoading}
          />
        )}
        {!isPracticeQuestion ? (
          <>
            <StyledDivSec>
              <ScoreInputWrapper>
                <ScoreInput
                  data-cy="scoreInput"
                  onChange={(e) =>
                    this.onChangeScore(showGradingRubricButton)(
                      e.target.value,
                      InputType.InputScore
                    )
                  }
                  onFocus={this.handleScoreInputFocus}
                  onBlur={this.submitScore}
                  value={_score}
                  disabled={
                    isPresentationMode ||
                    isPracticeQuestion ||
                    isScoreInputDisabled
                  }
                  ref={this.scoreInput}
                  onKeyDown={this.onKeyDownFeedback}
                  tabIndex={0}
                />
                <TextPara>{_maxScore}</TextPara>
              </ScoreInputWrapper>
            </StyledDivSec>
            <GradingPolicyWrapper>
              GRADING POLICY &nbsp;
              <GradingPolicy data-cy="gradingPolicyType">
                {activity.scoringType}
              </GradingPolicy>
            </GradingPolicyWrapper>
          </>
        ) : (
          <UnScored data-cy="unscoredInput" text="Zero Point" height="50px" />
        )}

        {showHintUsed && (
          <GradingPolicyWrapper>
            HINTS USED &nbsp;
            <GradingPolicy data-cy="hintsUsed">
              {hintsUsed ? 'Yes' : 'No'}
            </GradingPolicy>
          </GradingPolicyWrapper>
        )}

        {showGradingRubricButton && (
          <RubricGrading
            rubricData={rubricDetails}
            maxScore={rubricMaxScore}
            rubricFeedback={rubricFeedback}
            currentScore={activity?.score}
            onRubricResponse={this.handleRubricResponse}
            isRubricDisabled={isRubricDisabled}
            onChangeScore={this.onChangeScore(showGradingRubricButton)}
            clearRubricFeedback={clearRubricFeedback}
            InputType={InputType}
            inputScore={_score}
            showWarningToClear={showWarningToClear}
            enableScoreInput={this.enableScoreInput}
          />
        )}
        {!isError && (
          <FeedbaclInputWrapper>
            <FeedbackInputInnerWrapper isAbsolutePos={isAbsolutePos}>
              <LeaveDiv>
                <span>
                  {isError ? 'Score is too large' : 'Student Feedback!'}
                </span>
                {showFeedbackSaveBtn && (
                  <EduButton height="32px" onClick={this.preCheckSubmit}>
                    Save
                  </EduButton>
                )}
              </LeaveDiv>
              {!isShowFeedbackInput && (
                <FeedbackDisplay onClick={this.showFeedbackInput}>
                  {feedback}
                </FeedbackDisplay>
              )}
              <FeedbackInput
                tabIndex={0}
                autoSize
                ref={this.feedbackInputRef}
                data-cy="feedBackInput"
                onChange={this.onChangeFeedback}
                value={feedback}
                onFocus={this.focusFeedbackInput}
                onBlur={this.blurFeedbackInput}
                disabled={!activity || isPresentationMode}
                onKeyDown={this.onKeyDownFeedback}
                isShowFeedbackInput={isShowFeedbackInput}
              />
            </FeedbackInputInnerWrapper>
          </FeedbaclInputWrapper>
        )}
      </StyledCardTwo>
    )
  }
}

FeedbackRight.propTypes = {
  widget: PropTypes.shape({
    evaluation: PropTypes.object,
  }).isRequired,
  user: PropTypes.object.isRequired,
  studentName: PropTypes.string,
  loadFeedbackResponses: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isPresentationMode: PropTypes.bool,
  color: PropTypes.string,
  icon: PropTypes.string,
}

FeedbackRight.defaultProps = {
  studentName: '',
  isPresentationMode: false,
  color: '',
  icon: '',
}

const enhance = compose(
  React.memo,
  withRouter,
  withWindowSizes,
  withNamespaces('header'),
  connect(
    (state) => ({
      user: getUserSelector(state),
      waitingResponse: getStatus(state),
      errorMessage: getErrorResponse(state),
      classBoardData: state.author_classboard_testActivity?.data,
      allAnswers: state?.answers,
      userThumbnail: getUserThumbnail(state),
      userFullName: getUserFullNameSelector(state),
      isClassResponseLoading: state?.studentResponse?.loading,
      studentQuestionResponseUpdatedAt:
        state?.studentQuestionResponse?.data?.updatedAt,
      classQuestionResponseData: state.classQuestionResponse.data,
    }),
    {
      loadFeedbackResponses: receiveFeedbackResponseAction,
      updateQuestionActivityScore: updateStudentQuestionActivityScoreAction,
      setTeacherEditedScore: setTeacherEditedScoreAction,
    }
  )
)
export default enhance(FeedbackRight)

const StyledCardTwo = styled(Card)`
  display: ${(props) => (props.disabled ? 'none' : 'flex')};
  border-radius: 10px;
  border: 1px solid #dadae4;
  flex-direction: column;
  flex: 3;
  margin: 0px 0px 0px 15px;
  min-height: 100%;
  max-width: 250px;
  .ant-card-head {
    height: 60px;
  }
  .ant-card-head-title {
    padding: 13px 0px;
  }
  .ant-card-body {
    position: relative;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .ant-input-disabled {
      padding: 4px 22px;
    }
  }

  @media screen and (min-width: ${desktopWidth}) {
    width: ${({ twoColLayout, showCollapseBtn }) =>
      showCollapseBtn ? 'auto' : twoColLayout?.second || '250px'};
    min-width: 250px;
  }
  @media (max-width: ${mobileWidthMax}) {
    margin-left: 0px;
    min-width: 100%;
    .ant-card-body {
      height: 200px;
    }
  }
`

const StyledDivSec = styled.div`
  height: 50px;
  margin: 0px auto;
  display: flex;
  justify-content: center;
`

const ScoreInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
`

const ScoreInput = styled(Input)`
  width: 70%;
  height: 47px;
  border: 0px;
  background-color: #f8f8f8;
  border-radius: 2px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
`

const TextPara = styled.p`
  padding-left: 10px;
  padding-right: 15px;
  font-size: 28px;
  font-weight: 600;
  line-height: 47px;
  background-color: #ececec;
  height: 47px;
  width: 30%;
  border-radius: 0px 2px 2px 0px;
  display: inline-block;
`
const GradingPolicyWrapper = styled.p`
  text-transform: uppercase;
  margin-top: 10px;
  font-size: 9px;
  font-weight: 600;
  width: 100%;
  display: inline-block;
`

const GradingPolicy = styled.span`
  color: ${tabGrey};
`

const LeaveDiv = styled.div`
  margin: 0px 0px 10px;
  font-weight: 600;
  color: ${tabGrey};
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
`

const TitleDiv = styled.div`
  font-weight: 400;
  color: ${tabGrey};
  font-size: 13px;
  display: flex;
  align-items: center;
`

const FeedbackInput = styled(TextArea)`
  width: 100%;
  border: 0;
  border-radius: 2px;
  display: inline-block;
  background: #f8f8f8;
  display: ${({ isShowFeedbackInput }) => !isShowFeedbackInput && 'none'};
`
const FeedbackDisplay = styled.div`
  width: 100%;
  padding: 4px 11px;
  overflow: hidden;
  background: #f8f8f8;
  border-radius: 2px;
  line-height: 1.5;
  max-height: 32px;
  min-height: 32px;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
`

const UserAvatar = styled(Avatar)`
  background-color: ${themeColorTagsBg};
  width: 34px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border-radius: 50%;
  color: ${themeColor};
  font-weight: 600;
  margin-right: 10px;
  font-size: 14px;
  text-transform: uppercase;
`

const FeedbaclInputWrapper = styled.div`
  min-height: 74px;
  margin-top: 12px;
  position: relative;
`

const FeedbackInputInnerWrapper = styled.div`
  background: ${white};
  position: ${({ isAbsolutePos }) => isAbsolutePos && 'absolute'};
  bottom: ${({ isAbsolutePos }) => isAbsolutePos && 0};
  width: 100%;
`
