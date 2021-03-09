import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'
import { withRouter } from 'react-router'
import { head, get, isEmpty, round, sumBy } from 'lodash'
import {
  greyGraphstroke,
  incorrect,
  yellow1,
  white,
  themeColor,
  skippedBarColor,
} from '@edulastic/colors'
import { IconEye, IconEyeClose } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import {
  scrollTo,
  AnswerContext,
  Legends,
  LegendContainer,
  LCBScrollContext,
  EduButton,
} from '@edulastic/common'
import { testActivityStatus } from '@edulastic/constants'
import { getAvatarName } from '../ClassBoard/Transformer'

import { StyledFlexContainer, StyledCard, TooltipContainer } from './styled'
import StudentResponse from './component/studentResponses/studentResponse'
import {
  StudentButtonWrapper,
  StudentButtonDiv,
  AllButton,
  CorrectButton,
  WrongButton,
  PartiallyCorrectButton,
} from '../StudentView/styled'
import ClassQuestions from '../ClassResponses/components/Container/ClassQuestions'

// actions
import { receiveAnswersAction } from '../src/actions/classBoard'
// selectors
import {
  getAdditionalDataSelector,
  getAllStudentsList,
  getAssignmentClassIdSelector,
  getClassQuestionSelector,
  getQLabelsSelector,
} from '../ClassBoard/ducks'
import HooksContainer from '../ClassBoard/components/HooksContainer/HooksContainer'
import { setStudentViewFilterAction as setFilterAction } from '../src/reducers/testActivity'

/**
 * @param {string} studentId
 */
const _scrollTo = (studentId, el) => {
  scrollTo(
    document.querySelector(`.student-question-container-id-${studentId}`),
    160,
    el
  )
}

const green = '#5eb500'

const CustomTooltip = ({ payload }) => {
  const firstItem = head(payload) || {}
  const timeSpent = get(firstItem, 'payload.avgTimeSpent')
  const fullName = get(firstItem, 'payload.name')
  const score = get(firstItem, 'payload.score')
  return (
    <TooltipContainer title={fullName}>
      {`Time(seconds): ${timeSpent || 0}`} <br /> {`Score: ${score}`}
    </TooltipContainer>
  )
}

CustomTooltip.propTypes = {
  payload: PropTypes.object,
}

CustomTooltip.defaultProps = {
  payload: {},
}

class QuestionViewContainer extends Component {
  // eslint-disable-next-line react/static-property-placement
  static contextType = LCBScrollContext

  static getDerivedStateFromProps(nextProps, preState) {
    const {
      loadClassQuestionResponses,
      assignmentIdClassId: { assignmentId, classId } = {},
      question,
    } = nextProps
    const { question: _question = {} } = preState || {}
    if (question.id !== _question.id) {
      loadClassQuestionResponses(
        assignmentId,
        classId,
        question.id,
        nextProps.itemId
      )
    }
    return {
      question,
      loading: question.id !== _question.id,
    }
  }

  state = {
    hideCorrectAnswer: true,
  }

  isMobile = () => window.innerWidth < 480

  // calcTimeSpent = (student = {}) => {
  //   const {
  //     question: { id: qId }
  //   } = this.props;
  //   const { timeSpent = 0 } = student.questionActivities.find(({ _id }) => _id === qId);
  //   return round(timeSpent / 1000, 2);
  // };

  calcTimeSpentAsSec = (activities = []) => {
    const totalSpent = sumBy(activities, ({ timeSpent }) => timeSpent || 0)
    return round(totalSpent / activities.length / 1000, 2)
  }

  onClickTab = (filter) => {
    const { setFilter } = this.props
    setFilter(filter)
    scrollTo(document.querySelector('body'), 160, this.context.current)
  }

  onClickChart = (data) => {
    _scrollTo(data.id, this.context.current)
  }

  toggleShowCorrectAnswers = () => {
    this.setState((prevState) => ({
      hideCorrectAnswer: !prevState.hideCorrectAnswer,
    }))
  }

  render() {
    const {
      testActivity,
      classResponse: { testItems, ...others },
      question,
      classQuestion,
      children,
      qIndex,
      isQuestionView = false,
      isPresentationMode,
      labels,
      t,
      match,
      itemId,
      additionalData,
      studentsList,
      filter,
      isDocBased,
    } = this.props
    const { loading, hideCorrectAnswer } = this.state
    let filteredItems = testItems?.filter((item) =>
      item.data.questions.some((q) => q.id === question.id)
    )

    filteredItems = produce(filteredItems, (draft) => {
      draft?.forEach((item) => {
        if (item.itemLevelScoring) return
        item.data.questions = item.data.questions.filter(
          ({ id }) => id === question.id
        )
        item.rows = item.rows.map((row) => ({
          ...row,
          widgets: row.widgets.filter(
            ({ reference, widgetType }) =>
              reference === question.id || widgetType === 'resource'
          ),
        }))
      })
      return draft
    })
    const isMobile = this.isMobile()
    let data = []
    // if (testActivity.length > 0) {
    //   testActivity.map(student => {
    //     if (student.status === "submitted") {
    //       data.push({
    //         name: student.studentName,
    //         score: student.score ? student.score : 0,
    //         time: 0,
    //         maxscore: student.maxScore,
    //         avgTimeSpent: this.calcTimeSpent(student),
    //         attempts: student.questionActivities.length
    //       });
    //     }
    //     return "";
    //   });
    // }
    const activeQuestions = isDocBased
      ? classQuestion.filter((x) => x.qid === question.id)
      : classQuestion
    /**
     * copied from
     *  https://github.com/snapwiz/edulastic-poc/blob/eacf271e7792e2e452b2fcc427340fc57c67434d/src/client/author/StudentView/index.js#L197
     * TODO: refactor to compute these counts in single loop/reduce
     */
    const totalNumber = activeQuestions.length

    const correctNumber = activeQuestions.filter(
      (x) => x.score === x.maxScore && x.score > 0
    ).length

    const wrongNumber = activeQuestions.filter(
      (x) => x.score === 0 && x.maxScore > 0 && x.graded && !x.skipped
    ).length

    const partiallyCorrectNumber = activeQuestions.filter(
      (x) => x.score > 0 && x.score < x.maxScore
    ).length

    const skippedNumber = activeQuestions.filter(
      (x) => x.skipped && x.score === 0
    ).length

    const notGradedNumber = activeQuestions.filter(
      (x) => !x.skipped && x.graded === false
    ).length

    if (!isEmpty(testActivity)) {
      data = testActivity
        .filter(
          (student) =>
            (student.status != 'notStarted' || student.redirect) &&
            student.status != 'absent' &&
            student.UTASTATUS !== testActivityStatus.NOT_STARTED
        )
        .map((st) => {
          const name = isPresentationMode
            ? st.fakeName
            : st.studentName || t('common.anonymous')
          const stData = {
            name,
            id: st.studentId,
            avatarName: getAvatarName(name),

            avgTimeSpent: this.calcTimeSpentAsSec(
              st.questionActivities.filter((x) => x._id === question.id)
            ),
            attempts: st.questionActivities.length,
            correct: 0,
            wrong: 0,
            pCorrect: 0,
            skipped: 0,
            manuallyGraded: 0,
            score: 0,
          }
          st.questionActivities
            .filter(({ notStarted, _id }) => !notStarted && _id === question.id)
            .forEach(({ skipped, graded, score, maxScore }) => {
              if (skipped) {
                stData.skipped += 1
              } else if (graded === false) {
                stData.manuallyGraded += 1
              } else if (score === maxScore && score > 0) {
                stData.correct += 1
              } else if (score > 0 && score < maxScore) {
                stData.pCorrect += 1
              } else if (score === 0) {
                stData.wrong += 1
              }
              stData.score = score

              return null
            })
          return stData
        })
    }

    if (isMobile) {
      data = data.slice(0, 2)
    }
    const { assignmentId, classId } = match.params
    return (
      <>
        {studentsList.length && itemId && (
          <HooksContainer
            additionalData={additionalData}
            classId={classId}
            assignmentId={assignmentId}
            itemId={itemId}
            qid={question?._id}
            studentsList={studentsList}
            selectedTab="questionView"
          />
        )}

        <StyledFlexContainer>
          <StyledCard bordered={false}>
            <LegendContainer>
              <Legends />
              {children}
            </LegendContainer>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart barGap={1} barSize={36} data={data}>
                <XAxis
                  dataKey="avatarName"
                  tickSize={0}
                  cursor="pointer"
                  dy={10}
                  onClick={({ index }) => {
                    const { id } = data[index]
                    _scrollTo(id, this.context.current)
                  }}
                />

                <YAxis
                  dataKey="attempts"
                  yAxisId={0}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: greyGraphstroke }}
                  tickSize={6}
                  label={{
                    value: 'Scoring points',
                    angle: -90,
                    fill: greyGraphstroke,
                    dx: -10,
                  }}
                  stroke={greyGraphstroke}
                />
                <YAxis
                  dataKey="avgTimeSpent"
                  yAxisId={1}
                  allowDecimals={false}
                  tick={{ strokeWidth: 0, fill: greyGraphstroke }}
                  tickSize={6}
                  label={{
                    value: 'AVG TIME (SECONDS)',
                    angle: -90,
                    fill: greyGraphstroke,
                    dx: 20,
                    fontSize: '10px',
                  }}
                  orientation="right"
                  stroke={greyGraphstroke}
                />
                <Bar
                  className="correct"
                  style={{ cursor: 'pointer' }}
                  stackId="a"
                  dataKey="correct"
                  fill={green}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="wrong"
                  style={{ cursor: 'pointer' }}
                  stackId="a"
                  dataKey="wrong"
                  fill={incorrect}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="pCorrect"
                  style={{ cursor: 'pointer' }}
                  stackId="a"
                  dataKey="pCorrect"
                  fill={yellow1}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="skipped"
                  style={{ cursor: 'pointer' }}
                  stackId="a"
                  dataKey="skipped"
                  fill={skippedBarColor}
                  onClick={this.onClickChart}
                />
                <Bar
                  className="manuallyGraded"
                  style={{ cursor: 'pointer' }}
                  stackId="a"
                  dataKey="manuallyGraded"
                  fill="rgb(56, 150, 190)"
                  onClick={this.onClickChart}
                />
                <Line
                  dataKey="avgTimeSpent"
                  stroke={themeColor}
                  strokeWidth="3"
                  type="monotone"
                  yAxisId={1}
                  dot={{ stroke: themeColor, strokeWidth: 6, fill: white }}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </StyledCard>
        </StyledFlexContainer>
        <StudentResponse isPresentationMode={isPresentationMode}>
          <StudentButtonWrapper>
            <StudentButtonDiv>
              <AllButton
                active={filter === null}
                onClick={() => this.onClickTab(null)}
              >
                ALL ({totalNumber})
              </AllButton>
              <CorrectButton
                active={filter === 'correct'}
                onClick={() => this.onClickTab('correct')}
              >
                CORRECT ({correctNumber})
              </CorrectButton>
              <WrongButton
                active={filter === 'wrong'}
                onClick={() => this.onClickTab('wrong')}
              >
                INCORRECT ({wrongNumber})
              </WrongButton>
              <WrongButton
                active={filter === 'partial'}
                onClick={() => this.onClickTab('partial')}
              >
                PARTIALLY CORRECT ({partiallyCorrectNumber})
              </WrongButton>
              <WrongButton
                active={filter === 'skipped'}
                onClick={() => this.onClickTab('skipped')}
              >
                SKIPPED ({skippedNumber})
              </WrongButton>
              <PartiallyCorrectButton
                active={filter === 'notGraded'}
                onClick={() => this.onClickTab('notGraded')}
              >
                NOT GRADED ({notGradedNumber})
              </PartiallyCorrectButton>
            </StudentButtonDiv>
            <EduButton
              isGhost
              height="24px"
              fontSize="9px"
              mr="28px"
              onClick={this.toggleShowCorrectAnswers}
            >
              {hideCorrectAnswer ? <IconEye /> : <IconEyeClose />}
              <span data-cy="showCorrectAnswer" data-test={!hideCorrectAnswer}>
                correct answers
              </span>
            </EduButton>
          </StudentButtonWrapper>
        </StudentResponse>

        {testActivity &&
          !loading &&
          testActivity.map((student, index) => {
            if (
              !student.testActivityId ||
              student.status === 'absent' ||
              student.UTASTATUS === testActivityStatus.NOT_STARTED
            ) {
              return null
            }
            const qActivities = classQuestion.filter(
              ({ userId }) => userId === student.studentId
            )
            return (
              <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
                <ClassQuestions
                  key={index}
                  isQuestionView={isQuestionView}
                  qIndex={qIndex}
                  currentStudent={student}
                  studentViewFilter={filter}
                  classResponse={{ testItems: filteredItems, ...others }}
                  questionActivities={qActivities}
                  isPresentationMode={isPresentationMode}
                  labels={labels}
                  isLCBView
                  hideCorrectAnswer={hideCorrectAnswer}
                />
              </AnswerContext.Provider>
            )
          })}
      </>
    )
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('student'),
  connect(
    (state) => ({
      classQuestion: getClassQuestionSelector(state),
      assignmentIdClassId: getAssignmentClassIdSelector(state),
      labels: getQLabelsSelector(state),
      additionalData: getAdditionalDataSelector(state),
      studentsList: getAllStudentsList(state),
      filter: state?.author_classboard_testActivity?.studentViewFilter,
      isDocBased: state?.author_classboard_testActivity?.data?.test?.isDocBased,
    }),
    {
      loadClassQuestionResponses: receiveAnswersAction,
      setFilter: setFilterAction,
    }
  )
)

const QuestionViewContainerConnected = enhance(QuestionViewContainer)
export default QuestionViewContainerConnected

QuestionViewContainer.propTypes = {
  classResponse: PropTypes.object.isRequired,
  question: PropTypes.object.isRequired,
  testActivity: PropTypes.array.isRequired,
  classQuestion: PropTypes.array,
  children: PropTypes.node,
  qIndex: PropTypes.number,
}
QuestionViewContainer.defaultProps = {
  classQuestion: [],
  children: null,
  qIndex: null,
}
