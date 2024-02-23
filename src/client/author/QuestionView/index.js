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
import { Pagination, Spin } from 'antd'
import { head, get, isEmpty, round, sumBy, groupBy } from 'lodash'
import {
  greyGraphstroke,
  incorrect,
  yellow1,
  white,
  themeColor,
  skippedBarColor,
  greyLight1,
} from '@edulastic/colors'
import { IconExpand, IconCollapse } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import {
  scrollTo,
  AnswerContext,
  Legends,
  LegendContainer,
  LCBScrollContext,
  EduButton,
} from '@edulastic/common'
import {
  testActivityStatus,
  questionActivity as questionActivityConst,
} from '@edulastic/constants'
import { getAvatarName } from '../ClassBoard/Transformer'

import { StyledFlexContainer, StyledCard, TooltipContainer } from './styled'
import StudentResponse from './component/studentResponses/studentResponse'
import { StudentButtonWrapper, StudentButtonDiv } from '../StudentView/styled'
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
  getPageNumberSelector,
  LCB_LIMIT_QUESTION_PER_VIEW,
  SCROLL_SHOW_LIMIT,
  getFirstQuestionEntitiesSelector,
} from '../ClassBoard/ducks'
import HooksContainer from '../ClassBoard/components/HooksContainer/HooksContainer'
import {
  setStudentViewFilterAction as setFilterAction,
  setPageNumberAction,
} from '../src/reducers/testActivity'
import {
  FilterSelect,
  FilterSpan,
} from '../ClassBoard/components/Container/styled'
import {
  PaginationWrapper,
  LoaderContainer,
} from '../ClassResponses/components/Container/styled'

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
  const unscoredItems = get(firstItem, 'payload.unscoredItems', 0)
  return (
    <TooltipContainer title={fullName}>
      {`Time(seconds): ${timeSpent || 0}`} <br />{' '}
      {`Score: ${unscoredItems ? 'unscored' : score}`}
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
      itemId,
      firstQuestionEntities,
    } = nextProps
    const { question: _question = {}, itemId: _itemId } = preState || {}
    if (question.id !== _question.id || itemId !== _itemId) {
      const questionIds =
        firstQuestionEntities.find((entity) => entity._id === question.id)
          ?.qids || []
      loadClassQuestionResponses(
        assignmentId,
        classId,
        question.id,
        itemId,
        questionIds
      )
    }
    return {
      question,
      itemId,
      loading: question.id !== _question.id,
    }
  }

  state = {
    hideCorrectAnswer: true,
    userId: '',
    showQuestionLoader: false,
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
    const { setFilter, setPageNumber } = this.props
    setFilter(filter)
    setPageNumber(1)
    scrollTo(document.querySelector('body'), 160, this.context.current)
  }

  componentDidUpdate(prevProps) {
    const { pageNumber, filter, setPageNumber } = this.props
    const { userId } = this.state
    if (filter != prevProps.filter && pageNumber !== 1) {
      // eslint-disable-next-line react/no-did-update-set-state
      setPageNumber(1)
    }
    if (prevProps.pageNumber !== pageNumber) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ userId: '', showQuestionLoader: false })
      _scrollTo(userId, this.context?.current)
    }
  }

  onClickChart = (data, index) => {
    const { pageNumber, setPageNumber } = this.props
    const questionPageNumber = Math.ceil(
      (index + 1) / LCB_LIMIT_QUESTION_PER_VIEW
    )
    if (questionPageNumber !== pageNumber) {
      this.setState({ userId: data.id, showQuestionLoader: true })
      setTimeout(() => setPageNumber(questionPageNumber), 1)
      return
    }
    _scrollTo(data.id, this.context.current)
  }

  toggleShowCorrectAnswers = () => {
    this.setState((prevState) => ({
      hideCorrectAnswer: !prevState.hideCorrectAnswer,
    }))
  }

  handleBottomScroll = () => {
    const { setPageNumber } = this.props
    setPageNumber()
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
      pageNumber,
      setPageNumber,
    } = this.props
    const { loading, hideCorrectAnswer, showQuestionLoader } = this.state
    let filteredItems = testItems?.filter(
      (item) =>
        item._id === itemId &&
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
              st.questionActivities.filter(
                (x) => x._id === question.id && x.testItemId === itemId
              )
            ),
            attempts: st.questionActivities.length,
            correct: 0,
            wrong: 0,
            pCorrect: 0,
            skipped: 0,
            manuallyGraded: 0,
            unscoredItems: 0,
            score: 0,
            testActivityData: { ...st },
            currentUqas: [],
          }
          const uqas = st.questionActivities.filter(
            ({ notStarted, _id, testItemId }) =>
              !notStarted && _id === question.id && testItemId === itemId
          )
          stData.currentUqas = uqas
          uqas.forEach(({ skipped, graded, score, maxScore, isPractice }) => {
            if (isPractice) {
              stData.unscoredItems += 1
            } else if (skipped) {
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

    const questionStatusCounts = data.reduce(
      (acc, item) => ({
        wrongNumber: item.wrong + acc.wrongNumber,
        correctNumber: item.correct + acc.correctNumber,
        partiallyCorrectNumber: item.pCorrect + acc.partiallyCorrectNumber,
        skippedNumber: item.skipped + acc.skippedNumber,
        notGradedNumber: item.manuallyGraded + acc.notGradedNumber,
        unscoredItems: item.unscoredItems + acc.unscoredItems,
      }),
      {
        totalNumber: 0,
        correctNumber: 0,
        wrongNumber: 0,
        partiallyCorrectNumber: 0,
        skippedNumber: 0,
        notGradedNumber: 0,
        unscoredItems: 0,
      }
    )

    questionStatusCounts.totalNumber = data.length

    if (isMobile) {
      data = data.slice(0, 2)
    }
    const { assignmentId, classId } = match.params
    const questionActivitiesGroupedByUserId = groupBy(classQuestion, 'userId')
    const filteredTestActivities =
      (!loading &&
        data.filter(({ testActivityData: student, currentUqas }) => {
          if (
            !student.testActivityId ||
            student.status === 'absent' ||
            student.UTASTATUS === testActivityStatus.NOT_STARTED
          ) {
            return false
          }
          const qActivities =
            questionActivitiesGroupedByUserId[student.studentId] || []
          /**
           * Here if question activity length is 0, which means that there is no attempt for the question
           * by the student so, for INPROGRESS student we will show unattempted questions only in ALL filter
           * and for submitted student we will unattempted questions in ALL filter as well as SKIPPED filter
           * hence returning null in case of other filters.
           */
          if (
            !qActivities.length &&
            ((filter && student.UTASTATUS === testActivityStatus.START) ||
              (student.UTASTATUS === testActivityStatus.SUBMITTED &&
                filter &&
                filter !== 'skipped' &&
                filter !== 'unscoredItems'))
          )
            return false

          if (!filter) return true

          const currentUQA = currentUqas?.[0] || {}

          if (filter === 'unscoredItems' && currentUQA.isPractice) {
            return true
          }
          if (filter === 'skipped' && currentUQA.skipped) {
            return true
          }
          if (filter === 'notGraded' && currentUQA.graded === false) {
            return true
          }
          if (
            filter === 'correct' &&
            currentUQA.score === currentUQA.maxScore &&
            currentUQA.score > 0
          ) {
            return true
          }
          if (
            filter === 'partial' &&
            currentUQA.score > 0 &&
            currentUQA.score < currentUQA.maxScore
          ) {
            return true
          }
          if (
            filter === 'wrong' &&
            currentUQA.score === 0 &&
            !currentUQA.skipped &&
            currentUQA.graded
          ) {
            return true
          }
          return false
        })) ||
      []

    const shouldShowPagination =
      filteredTestActivities.length > SCROLL_SHOW_LIMIT

    const itemsToRender = shouldShowPagination
      ? filteredTestActivities.slice(
          LCB_LIMIT_QUESTION_PER_VIEW * (pageNumber - 1),
          LCB_LIMIT_QUESTION_PER_VIEW * pageNumber
        )
      : filteredTestActivities

    return (
      <>
        {showQuestionLoader && (
          <LoaderContainer>
            <Spin size="large" />
          </LoaderContainer>
        )}
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
                    this.onClickChart(data[index], index)
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
                  className="unscoredItems"
                  style={{ cursor: 'pointer' }}
                  stackId="a"
                  dataKey="unscoredItems"
                  fill={greyLight1}
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
              <FilterSpan>FILTER BY STATUS</FilterSpan>
              <FilterSelect
                data-cy="filterByAttemptType"
                className="student-status-filter"
                value={filter}
                dropdownMenuStyle={{ fontSize: 29 }}
                getPopupContainer={(trigger) => trigger.parentElement}
                onChange={this.onClickTab}
                width="170px"
                height="24px"
              >
                {questionActivityConst.questionStatusOptions.map(
                  ({ title, value, countValue }, i) => (
                    <FilterSelect.Option
                      className="student-status-filter-item"
                      key={i}
                      value={value}
                      style={{ fontSize: 11 }}
                    >
                      {title} ({questionStatusCounts[countValue]})
                    </FilterSelect.Option>
                  )
                )}
              </FilterSelect>
            </StudentButtonDiv>
            <EduButton
              isGhost
              height="24px"
              fontSize="9px"
              ml="10px"
              onClick={this.toggleShowCorrectAnswers}
              title="Minimizing view hides correct answers, maximize to view them"
            >
              {hideCorrectAnswer ? (
                <IconExpand height="11.3px" width="11.3px" />
              ) : (
                <IconCollapse height="11.3px" width="11.3px" />
              )}
              <span data-cy="showCorrectAnswer" data-test={!hideCorrectAnswer}>
                {hideCorrectAnswer ? 'Maximize view' : 'Minimize view'}
              </span>
            </EduButton>
          </StudentButtonWrapper>
        </StudentResponse>
        {itemsToRender.map(({ testActivityData: student }, index) => {
          const qActivities =
            questionActivitiesGroupedByUserId[student.studentId] || []

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

        {shouldShowPagination && (
          <PaginationWrapper>
            <Pagination
              defaultCurrent={1}
              current={pageNumber}
              pageSize={LCB_LIMIT_QUESTION_PER_VIEW}
              total={filteredTestActivities.length}
              hideOnSinglePage
              onChange={(page) => {
                this.setState({ showQuestionLoader: true })
                setTimeout(() => setPageNumber(page), 1)
              }}
            />
          </PaginationWrapper>
        )}
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
      pageNumber: getPageNumberSelector(state),
      firstQuestionEntities: getFirstQuestionEntitiesSelector(state),
    }),
    {
      loadClassQuestionResponses: receiveAnswersAction,
      setFilter: setFilterAction,
      setPageNumber: setPageNumberAction,
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
