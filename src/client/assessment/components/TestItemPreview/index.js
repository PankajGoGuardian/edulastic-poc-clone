/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { ThemeProvider, withTheme } from 'styled-components'
import { get, isEqual } from 'lodash'
import { white } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { IconClockCircularOutline } from '@edulastic/icons'
import { AssessmentPlayerContext, withWindowSizes } from '@edulastic/common'
import { questionType } from '@edulastic/constants'

import { connect } from 'react-redux'
import { themes } from '../../../theme'
import TestItemCol from './containers/TestItemCol'
import { Container, RenderFeedBack } from './styled/Container'
import FeedbackWrapper from '../FeedbackWrapper'
import { TimeSpentWrapper } from '../QuestionWrapper'
import ShowUserWork from '../Common/ShowUserWork'
import { IPAD_LANDSCAPE_WIDTH } from '../../constants/others'
import Divider from './Divider'

class TestItemPreview extends Component {
  constructor(props) {
    super(props)
    const { isPassageWithQuestions, isLCBView } = props
    const toggleCollapseMode =
      (window.innerWidth < IPAD_LANDSCAPE_WIDTH && isPassageWithQuestions) ||
      (isPassageWithQuestions && isLCBView)
    this.state = {
      toggleCollapseMode,
      collapseDirection: toggleCollapseMode ? 'left' : '',
      value: 0,
      dimensions: { height: 0, width: 0 },
      isFeedbackVisible: false,
    }
    this.containerRef = React.createRef()
    this.feedbackRef = React.createRef()
  }

  getStyle = (first) => {
    const { verticalDivider, scrolling } = this.props

    const style = {}

    if (first && verticalDivider) {
      style.borderRightWidth = '3px'
      style.borderRightStyle = 'solid'
    }

    if (scrolling) {
      style.height = 'calc(100vh - 200px)'
      style.overflowY = 'auto'
    }

    return style
  }

  setCollapseView = (dir) => {
    this.setState((prevState) => ({
      collapseDirection:
        !prevState.toggleCollapseMode && prevState.collapseDirection ? '' : dir,
    }))
  }

  renderCollapseButtons = () => {
    const { isLCBView } = this.props
    const { collapseDirection } = this.state
    return (
      <Divider
        collapseDirection={collapseDirection}
        setCollapseView={this.setCollapseView}
        hideMiddle={isLCBView}
        stackedView={this.showStackedView}
      />
    )
  }

  getFeedBackVisibility = ({ widgetIndex, colIndex, stackedView }) => {
    const {
      isDocBased,
      isPassageWithQuestions,
      isStudentReport,
      itemLevelScoring,
    } = this.props
    const { isStudentAttempt } = this.context
    let shouldShowFeedback
    let shouldTakeDimensionsFromStore
    switch (true) {
      case isStudentAttempt && itemLevelScoring:
        shouldShowFeedback = widgetIndex === 0 && colIndex === 0
        shouldTakeDimensionsFromStore = false
        break
      case isStudentAttempt && !itemLevelScoring:
        shouldShowFeedback = true
        shouldTakeDimensionsFromStore = true
        break

      case isDocBased || stackedView:
        /**
         * stacked view
         * need to show separate feeback blocks for each question
         */
        shouldShowFeedback = true
        shouldTakeDimensionsFromStore = true
        break

      case isPassageWithQuestions:
        /**
         * for passages with item level scoring off show seperate feedback block
         * and get dimensions from store
         */
        shouldShowFeedback = true
        shouldTakeDimensionsFromStore = true
        break

      case isStudentReport:
        shouldShowFeedback = true
        shouldTakeDimensionsFromStore = false
        break

      default:
        /**
         *  multipart with item level scoring on
         *  or single question view
         *  show only one feedback block
         */
        shouldShowFeedback = widgetIndex === 0 && colIndex === 0
        shouldTakeDimensionsFromStore = false
        break
    }

    return [shouldShowFeedback, shouldTakeDimensionsFromStore]
  }

  renderFeedback = (widget, index, colIndex, stackedView) => {
    const {
      showFeedback,
      previousQuestionActivity = [],
      isStudentReport,
      isPresentationMode,
      questions,
      isExpressGrader,
      isPrintPreview,
      showCollapseBtn,
      studentId,
      studentName,
      itemId,
      t,
    } = this.props

    const [
      displayFeedback,
      shouldTakeDimensionsFromStore,
    ] = this.getFeedBackVisibility({
      widgetIndex: index,
      colIndex,
      stackedView,
    })
    const question = questions[widget.reference]
    const prevQActivityForQuestion = previousQuestionActivity.find(
      (qa) => qa.qid === question.id
    )
    const testActivityId = question?.activity?.testActivityId
    return displayFeedback ? (
      <FeedbackWrapper
        showFeedback={showFeedback}
        displayFeedback={displayFeedback}
        isPrintPreview={isPrintPreview}
        isExpressGrader={isExpressGrader}
        showCollapseBtn={showCollapseBtn}
        prevQActivityForQuestion={prevQActivityForQuestion}
        data={{ ...question, smallSize: true }}
        isStudentReport={isStudentReport}
        isPresentationMode={isPresentationMode}
        shouldTakeDimensionsFromStore={shouldTakeDimensionsFromStore}
        studentId={studentId}
        studentName={studentName || t('common.anonymous')}
        itemId={itemId}
        key={`${testActivityId}_${index}`}
        ref={this.feedbackRef}
      />
    ) : null
  }

  renderFeedbacks = () => {
    const { cols } = this.props
    const { value } = this.state
    let colIndex = 0
    return cols.map((col) =>
      (col?.widgets || [])
        .filter(
          (widget) =>
            widget.type !== questionType.SECTION_LABEL &&
            widget.widgetType !== 'resource'
        )
        .map((widget, i) => (
          <React.Fragment key={i}>
            {col.tabs &&
              !!col.tabs.length &&
              value === widget.tabIndex &&
              this.renderFeedback(widget, i, colIndex++, this.showStackedView)}
            {col.tabs &&
              !col.tabs.length &&
              this.renderFeedback(widget, i, colIndex++, this.showStackedView)}
          </React.Fragment>
        ))
    )
  }

  componentDidMount() {
    if (this.containerRef.current) {
      const elem = this.containerRef.current
      const currentHeight = elem.scrollHeight
      const currentWidth = elem.scrollWidth
      const { dimensions } = this.state
      const { width: previousWidth, height: previousHeight } = dimensions
      if (previousWidth !== currentWidth || previousHeight !== currentHeight) {
        this.setState({
          dimensions: { height: currentHeight, width: currentWidth },
        })
      }
    }

    /**
     * https://snapwiz.atlassian.net/browse/EV-20465
     * When feedbackElem is getting rendered we can say it is visible
     * */
    const feedbackElem = this.feedbackRef.current
    if (feedbackElem) {
      this.setState({ isFeedbackVisible: true })
    }
  }

  componentDidUpdate(prevProps) {
    const { cols: preCols } = prevProps
    const {
      cols,
      isPassageWithQuestions,
      scratchPadMode,
      isLCBView,
    } = this.props
    if (
      !scratchPadMode &&
      isPassageWithQuestions &&
      window.innerWidth < IPAD_LANDSCAPE_WIDTH &&
      (!isEqual(cols, preCols) || scratchPadMode !== prevProps.scratchPadMode)
    ) {
      this.setState({ toggleCollapseMode: true, collapseDirection: 'left' })
    } else if (
      scratchPadMode !== prevProps.scratchPadMode &&
      scratchPadMode &&
      !isLCBView
    ) {
      this.setState({ collapseDirection: '' })
    }
  }

  get showStackedView() {
    const {
      isLCBView,
      isQuestionView,
      multipartItem,
      isPassageWithQuestions,
      itemLevelScoring,
    } = this.props
    let showStackedView = false
    if (isLCBView && !isQuestionView && !isPassageWithQuestions) {
      if (multipartItem && !itemLevelScoring) {
        showStackedView = true
      }
    }

    return showStackedView
  }

  render() {
    const {
      cols,
      preview,
      style,
      windowWidth,
      showFeedback,
      questions,
      student,
      metaData,
      evaluation,
      previewTab,
      showCollapseBtn = false,
      scratchPadMode,
      fontFamily,
      theme,
      t,
      isCliUser,
      showPreviousAttempt,
      ...restProps
    } = this.props
    const {
      isStudentReport,
      LCBPreviewModal,
      isLCBView,
      isReviewTab,
      isExpressGrader,
      isQuestionView,
      showStudentWork,
      timeSpent,
      userWork,
      itemLevelScoring,
      isPrintPreview,
    } = restProps

    const { isFeedbackVisible, collapseDirection } = this.state
    const { isStudentAttempt } = this.context

    const widgets = (cols || []).flatMap((col) => col?.widgets).filter((q) => q)
    if (widgets.length === 0) {
      return null
    }

    const isSingleQuestionView = widgets.length === 1
    const hideInternalOverflow =
      isLCBView || isQuestionView || isExpressGrader || isReviewTab
    const hasResourceTypeQuestion = widgets.find(
      (item) => item && item.widgetType === 'resource'
    )
    // show collapse button only in student player or in author preview mode.
    const showCollapseButtons = hasResourceTypeQuestion && showCollapseBtn

    const hasDrawingResponse = widgets.some(
      (x) => x.type === questionType.HIGHLIGHT_IMAGE
    )

    let dataSource = cols
    if (!this.showStackedView && (isQuestionView || isExpressGrader)) {
      dataSource = dataSource.filter((col) => (col?.widgets || []).length > 0)
    }

    const borderProps = hasDrawingResponse
      ? {
          border: isLCBView ? '1px solid #DADAE4' : 'none',
          borderRadius: '10px',
        }
      : {}

    return (
      <ThemeProvider theme={{ ...themes.default }}>
        <div
          style={{
            ...borderProps,
            display: 'flex',
            flexDirection: 'column',
            alignSelf: !LCBPreviewModal && 'stretch',
            flexGrow: 1,
            width: '100%',
            overflow: !isStudentAttempt && !isPrintPreview && 'auto', // dont give auto for student attempt causes https://snapwiz.atlassian.net/browse/EV-12598
            background: isExpressGrader && hasDrawingResponse ? white : null,
            'margin-bottom': hasDrawingResponse && '10px',
          }}
          className="__print-item-fix-width"
        >
          <Container
            width={windowWidth}
            style={{
              ...style,
              padding: 0,
            }}
            isCollapsed={!!collapseDirection}
            ref={this.containerRef}
            className="test-item-preview"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection:
                  this.showStackedView || isPrintPreview ? 'column' : 'row',
              }}
            >
              {dataSource.map((col, i) => {
                const hideColumn =
                  (collapseDirection === 'left' && i === 0) ||
                  (collapseDirection === 'right' && i === 1)
                if (hideColumn && showCollapseButtons) return ''

                return (
                  <>
                    {(i > 0 || collapseDirection === 'left') &&
                      showCollapseButtons &&
                      this.renderCollapseButtons(i)}
                    <TestItemCol
                      {...restProps}
                      showCollapseBtn={showCollapseButtons}
                      evaluation={evaluation}
                      key={i}
                      colCount={cols.length}
                      colIndex={i}
                      col={
                        collapseDirection ? { ...col, dimension: '100%' } : col
                      }
                      view="preview"
                      metaData={metaData}
                      preview={preview}
                      scratchPadMode={scratchPadMode}
                      colWidth={
                        collapseDirection || cols.length == 1 ? '100%' : '50%'
                      }
                      multiple={cols.length > 1}
                      style={this.getStyle(i !== cols.length - 1)}
                      windowWidth={windowWidth}
                      showFeedback={showFeedback}
                      questions={questions}
                      student={student}
                      previewTab={previewTab}
                      isSingleQuestionView={isSingleQuestionView}
                      hideInternalOverflow={hideInternalOverflow}
                      showStackedView={this.showStackedView}
                      teachCherFeedBack={this.renderFeedback}
                      hasDrawingResponse={hasDrawingResponse}
                      isStudentAttempt={isStudentAttempt}
                      isFeedbackVisible={isFeedbackVisible}
                    />
                    {collapseDirection === 'right' &&
                      showCollapseButtons &&
                      this.renderCollapseButtons(i)}
                  </>
                )
              })}
            </div>
          </Container>
          {hasDrawingResponse && (isLCBView || isExpressGrader) && userWork && (
            <TimeSpentWrapper margin="0px 12px 12px">
              <ShowUserWork isGhost onClickHandler={showStudentWork} mr="8px">
                Show student work
              </ShowUserWork>
              <IconClockCircularOutline />
              {timeSpent}s
            </TimeSpentWrapper>
          )}
        </div>
        {/* on the student side, show single feedback only when item level scoring is on */}
        {((itemLevelScoring && isStudentReport) ||
          (!isStudentReport && !isReviewTab)) &&
          (showFeedback ||
            (showPreviousAttempt !== 'NONE' &&
              isStudentAttempt &&
              !isStudentReport)) && (
            <>
              {!isCliUser && (
                <RenderFeedBack
                  isExpressGrader={isExpressGrader}
                  isPrintPreview={isPrintPreview}
                  isStudentAttempt={isStudentAttempt}
                  className="__print-feedback-main-wrapper"
                >
                  {this.renderFeedbacks()}
                </RenderFeedBack>
              )}
            </>
          )}
      </ThemeProvider>
    )
  }
}

TestItemPreview.contextType = AssessmentPlayerContext

TestItemPreview.propTypes = {
  cols: PropTypes.array.isRequired,
  verticalDivider: PropTypes.bool,
  scrolling: PropTypes.bool,
  preview: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired,
  showFeedback: PropTypes.bool,
  style: PropTypes.object,
  questions: PropTypes.object.isRequired,
  student: PropTypes.object,
}

TestItemPreview.defaultProps = {
  showFeedback: false,
  verticalDivider: false,
  scrolling: false,
  style: { padding: 0, display: 'flex' },
  student: {},
}

const enhance = compose(
  withWindowSizes,
  withTheme,
  withNamespaces('student'),
  connect((state) => ({
    isCliUser: get(state, 'user.isCliUser', false),
    showPreviousAttempt: get(
      state,
      'test.settings.showPreviousAttempt',
      'NONE'
    ),
  }))
)

export default enhance(TestItemPreview)
