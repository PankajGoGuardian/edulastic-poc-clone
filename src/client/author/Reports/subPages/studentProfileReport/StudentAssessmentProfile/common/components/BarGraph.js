import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, groupBy, last } from 'lodash'
import { ticks } from 'd3-array'
import { connect } from 'react-redux'
import {
  white,
  dropZoneTitleColor,
  secondaryTextColor,
  themeColor,
} from '@edulastic/colors'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Rectangle,
  Tooltip,
} from 'recharts'
import {
  Legends,
  LegendContainer,
  notification,
  LCBScrollContext,
} from '@edulastic/common'
import {
  getHasRandomQuestionselector,
  getItemSummary,
  getPageNumberSelector,
  LCB_LIMIT_QUESTION_PER_VIEW,
} from '../../../../../../ClassBoard/ducks'
import {
  MainDiv,
  StyledCustomTooltip,
  OnScreenNotification,
} from '../../../../../../ClassBoard/components/BarGraph/styled'
import {
  setPageNumberAction,
  setLcbQuestionLoaderStateAcion,
  setQuestionIdToScrollAction,
} from '../../../../../../src/reducers/testActivity'
import {
  MAX_XGA_WIDTH,
  NORMAL_MONITOR_WIDTH,
  LARGE_DESKTOP_WIDTH,
  MAX_TAB_WIDTH,
} from '../../../../../../src/constants/others'
import { StyledChartNavButton } from '../../../../../common/styled'
import { _scrollTo, bars } from '../utils/utils'

const RectangleBar = ({ fill, x, y, width, height, dataKey, ...rest }) => {
  let radius = [5, 5, 0, 0]
  const availableBars = Object.keys(bars)
    .map((key) => (rest[key] !== 0 ? key : false))
    .filter((em) => em)

  if (dataKey !== last(availableBars)) {
    radius = null
  }
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      radius={radius}
    />
  )
}

class BarGraph extends Component {
  isMobile = () => window.innerWidth < 480

  static contextType = LCBScrollContext

  constructor(props) {
    super(props)
    let page = props.pageSize || 20
    const windowWidth = window.innerWidth
    if (this.isMobile()) {
      page = 5
    } else if (windowWidth >= LARGE_DESKTOP_WIDTH) {
      page = 20
    } else if (
      windowWidth >= NORMAL_MONITOR_WIDTH &&
      windowWidth < LARGE_DESKTOP_WIDTH
    ) {
      page = 15
    } else if (
      windowWidth >= MAX_XGA_WIDTH &&
      windowWidth < NORMAL_MONITOR_WIDTH
    ) {
      page = 10
    } else if (windowWidth >= MAX_TAB_WIDTH && windowWidth < MAX_XGA_WIDTH) {
      page = 7
    } else {
      /**
       * unknown small resolutions
       */
      page = 5
    }

    // README: When I was fixing the chart, I found no use case of "children". It was
    // already there. I didn't remove it since there might be some use case which I dont know about
    // Later it should be removed if it has no use case.
    this.state = {
      page,
      chartData: [],
      renderData: [],
      maxAttemps: 0,
      maxTimeSpent: 0,
      pagination: {
        startIndex: 0,
        endIndex: page - 1,
      },
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { testActivity, studentViewFilter } = props

    let questionsOrder = {}
    if (testActivity) {
      questionsOrder = (testActivity?.questionActivities || []).reduce(
        (acc, cur, ind) => {
          acc[cur._id] = ind
          return acc
        },
        {}
      )
    }
    let itemsSummary = getItemSummary([testActivity], questionsOrder)
    if (studentViewFilter) {
      itemsSummary = itemsSummary.filter((x) => {
        if (studentViewFilter === 'correct' && x.correctNum > 0) {
          return true
        }
        if (studentViewFilter === 'wrong' && x.wrongNum > 0) {
          return true
        }
        if (studentViewFilter === 'partial' && x.partialNum > 0) {
          return true
        }
        if (studentViewFilter === 'skipped' && x.skippedNum > 0) {
          return true
        }
        if (studentViewFilter === 'notGraded' && x.manualGradedNum > 0) {
          return true
        }
        if (studentViewFilter === 'unscoredItems' && x.unscoredItems > 0) {
          return true
        }
        return false
      })
    }
    let chartData = []

    let maxAttemps = 0
    let maxTimeSpent = 0
    if (itemsSummary.length) {
      chartData = itemsSummary.map((item) => {
        if (item.attemptsNum > maxAttemps) {
          maxAttemps = item.attemptsNum
        }
        if (item.avgTimeSpent > maxTimeSpent) {
          maxTimeSpent = item.avgTimeSpent
        }
        const { hiddenAttempt, clickDisabled } = item
        const result = {
          name: item.qLabel,
          totalAttemps: item.attemptsNum,
          avgTimeSpent: item.avgTimeSpent || 0,
          itemLevelScoring: item.itemLevelScoring,
          itemId: item.itemId,
          qid: item._id,
          clickDisabled,
        }
        if (hiddenAttempt) {
          return {
            ...result,
            correctAttemps: 0,
            partialAttempts: 0,
            incorrectAttemps: 0,
            manualGradedNum: 0,
            unscoredItems: 0,
            skippedNum: item.skippedNum,
            hiddenAttempt,
          }
        }
        return {
          ...result,
          correctAttemps: item.correctNum,
          partialAttempts: item.partialNum || 0,
          incorrectAttemps: item.wrongNum,
          manualGradedNum: item.manualGradedNum,
          unscoredItems: item.unscoredItems,
          skippedNum: item.skippedNum,
          hiddenAttempt: 0,
        }
      })
    }

    if (chartData.length !== state.chartData.length) {
      const renderData = chartData.slice(0, state.page)
      return {
        page: state.page,
        chartData,
        renderData,
        maxAttemps,
        maxTimeSpent,
        pagination: {
          startIndex: 0,
          endIndex: state.page - 1,
        },
      }
    }
    const renderData = chartData.slice(
      state.pagination.startIndex,
      state.pagination.startIndex + state.page
    )
    return {
      page: state.page,
      chartData,
      renderData,
      maxAttemps,
      maxTimeSpent,
      pagination: {
        startIndex: state.pagination.startIndex,
        endIndex: state.pagination.startIndex + state.page - 1,
      },
    }
  }

  scrollLeft = () => {
    const { pagination, page } = this.state
    let diff
    if (pagination.startIndex > 0) {
      if (pagination.startIndex >= page) {
        diff = page
      } else {
        diff = pagination.startIndex
      }
      this.setState((state) => ({
        ...state,
        pagination: {
          startIndex: state.pagination.startIndex - diff,
          endIndex: state.pagination.endIndex - diff,
        },
      }))
    }
  }

  scrollRight = () => {
    const { pagination, page, chartData } = this.state
    let diff
    if (pagination.endIndex < chartData.length - 1) {
      if (chartData.length - 1 - pagination.endIndex >= page) {
        diff = page
      } else {
        diff = chartData.length - 1 - pagination.endIndex
      }

      this.setState((state) => ({
        ...state,
        pagination: {
          startIndex: state.pagination.startIndex + diff,
          endIndex: state.pagination.endIndex + diff,
        },
      }))
    }
  }

  static propTypes = {
    // gradebook: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  static defaultProps = {
    children: null,
  }

  handleClick = (data, index) => {
    const {
      isLoading,
      studentview,
      onClickHandler,
      hasRandomQuestions,
      pageNumber,
      setPageNumber,
      setLcbQuestionLoaderState,
      setQuestionIdToScroll,
    } = this.props
    if (isLoading) {
      return
    }
    const { qid, itemId } = data
    if (studentview) {
      const questionNumber = data.name.split('.')[0].substr(1)
      const questionPageNumber = Math.ceil(
        questionNumber / LCB_LIMIT_QUESTION_PER_VIEW
      )
      if (questionPageNumber !== pageNumber) {
        setQuestionIdToScroll(`${itemId}_${qid}`)
        setLcbQuestionLoaderState(true)
        setTimeout(() => setPageNumber(questionPageNumber), 1)
        return
      }

      return _scrollTo(`${itemId}_${qid}`, this.context.current)
    }
    if (hasRandomQuestions) {
      return notification({
        messageKey: 'theQuestionForStudentsDynamicallySelectedAsResult',
      })
    }
    if (onClickHandler) {
      onClickHandler(data, index)
    }
  }

  calcTimeSpent(testItem) {
    const { studentResponse, studentview } = this.props
    let timeSpent = testItem.avgTimeSpent || 0
    if (studentview) {
      const getStudentActivity = get(
        studentResponse,
        'data.questionActivities',
        []
      )
      const groupActivityByQId = groupBy(getStudentActivity, 'qid') || {}
      const [timeSpentByItemId = {}] = groupActivityByQId[testItem._id] || []
      timeSpent = timeSpentByItemId.timeSpent || 0
    }
    return timeSpent
  }

  render() {
    const { children, hasRandomQuestions, isBoth } = this.props
    const {
      pagination,
      chartData,
      renderData,
      maxAttemps,
      maxTimeSpent,
    } = this.state
    return (
      <MainDiv className="studentBarChart">
        {children}
        <StyledChartNavButton
          type="primary"
          shape="circle"
          icon="caret-left"
          size="large"
          className="navigator navigator-left"
          onClick={this.scrollLeft}
          style={{
            visibility: pagination.startIndex === 0 ? 'hidden' : 'visible',
          }}
        />
        <StyledChartNavButton
          data-cy="lcbnextButton"
          type="primary"
          shape="circle"
          icon="caret-right"
          size="large"
          className="navigator navigator-right"
          onClick={this.scrollRight}
          style={{
            visibility:
              chartData.length <= pagination.endIndex + 1
                ? 'hidden'
                : 'visible',
          }}
        />
        <LegendContainer style={{ paddingLeft: '80px' }}>
          <Legends />
        </LegendContainer>
        <ResponsiveContainer width="99%" height={240}>
          {hasRandomQuestions && isBoth ? (
            <OnScreenNotification>
              The questions for each student have been dynamically selected and
              as a result, question based comparison is unavailable for this
              assignment.
            </OnScreenNotification>
          ) : chartData.length === 0 ? (
            <OnScreenNotification> No Question found </OnScreenNotification>
          ) : (
            <ComposedChart barGap={1} barSize={36} data={renderData}>
              <XAxis
                dataKey="name"
                tickSize={0}
                dy={8}
                tick={{
                  fontSize: '10px',
                  strokeWidth: 2,
                  fill: secondaryTextColor,
                }}
                padding={{ left: 20, right: 20 }}
                cursor="pointer"
                onClick={({ index }) => {
                  this.handleClick(renderData[index], index)
                }}
              />
              <YAxis
                domain={[0, maxAttemps + Math.ceil((10 / 100) * maxAttemps)]}
                yAxisId="left"
                allowDecimals={false}
                label={{
                  value: 'ATTEMPTS',
                  dx: -10,
                  angle: -90,
                  fill: dropZoneTitleColor,
                  fontSize: '10px',
                }}
              />
              <YAxis
                yAxisId="right"
                domain={[
                  0,
                  maxTimeSpent + Math.ceil((10 / 100) * maxTimeSpent),
                ]}
                allowDecimals={false}
                label={{
                  value: 'AVG TIME (SECONDS)',
                  angle: -90,
                  dx: 20,
                  fill: dropZoneTitleColor,
                  fontSize: '10px',
                }}
                orientation="right"
                ticks={ticks(0, maxTimeSpent + 10000, 10)}
                tickFormatter={(val) => Math.round(val / 1000)}
              />

              {Object.keys(bars).map((key) => (
                <Bar
                  {...bars[key]}
                  key={bars[key].dataKey}
                  shape={<RectangleBar dataKey={bars[key].dataKey} />}
                  onClick={this.handleClick}
                />
              ))}

              <Line
                yAxisId="right"
                dataKey="avgTimeSpent"
                stroke={themeColor}
                strokeWidth="3"
                type="monotone"
                dot={{ stroke: themeColor, strokeWidth: 6, fill: white }}
              />

              <Tooltip content={<StyledCustomTooltip />} cursor={false} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </MainDiv>
    )
  }
}

export default connect(
  (state) => ({
    hasRandomQuestions: getHasRandomQuestionselector(state),
    pageNumber: getPageNumberSelector(state),
  }),
  {
    setPageNumber: setPageNumberAction,
    setLcbQuestionLoaderState: setLcbQuestionLoaderStateAcion,
    setQuestionIdToScroll: setQuestionIdToScrollAction,
  }
)(BarGraph)
