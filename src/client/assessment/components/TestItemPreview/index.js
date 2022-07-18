/* eslint-disable react/no-did-update-set-state */
import React, { Component } from 'react'
import { get, isEqual, every } from 'lodash'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { ThemeProvider, withTheme } from 'styled-components'

import { white } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { AssessmentPlayerContext, withWindowSizes } from '@edulastic/common'
import { questionType } from '@edulastic/constants'

import { connect } from 'react-redux'
import { themes } from '../../../theme'
import TestItemCol from './containers/TestItemCol'
import { Container, RenderFeedBack } from './styled/Container'
import FeedbackWrapper from '../FeedbackWrapper'
import { IPAD_LANDSCAPE_WIDTH } from '../../constants/others'
import { changedPlayerContentAction } from '../../../author/sharedDucks/testPlayer'
import {
  getPageNumberSelector,
  LCB_LIMIT_QUESTION_PER_VIEW,
  SCROLL_SHOW_LIMIT,
} from '../../../author/ClassBoard/ducks'
import { setPageNumberAction } from '../../../author/src/reducers/testActivity'
import { getUser } from '../../../author/src/selectors/user'
import PassageDivider from '../../../common/components/PassageDivider'

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
    const { toggleCollapseMode } = this.state
    if (!dir && toggleCollapseMode) {
      return
    }
    this.setState(
      {
        collapseDirection: dir,
      },
      () => {
        const { changedPlayerContent } = this.props
        changedPlayerContent()
      }
    )
  }

  renderCollapseButtons = () => {
    const { isReviewTab, viewComponent } = this.props
    const { collapseDirection } = this.state

    if (isReviewTab) {
      return null
    }
    return (
      <PassageDivider
        onChange={this.setCollapseView}
        viewComponent={viewComponent}
        collapseDirection={collapseDirection}
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
        shouldTakeDimensionsFromStore = false
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
        shouldShowFeedback = itemLevelScoring
          ? widgetIndex === 0 && colIndex === 0
          : true
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
      itemLevelScoring,
      t,
      isQuestionView,
      itemIdKey,
      testItemId,
      isLCBView,
    } = this.props
    const [
      displayFeedback,
      shouldTakeDimensionsFromStore,
    ] = this.getFeedBackVisibility({
      widgetIndex: index,
      colIndex,
      stackedView,
    })
    const question =
      questions[`${itemId || itemIdKey || testItemId}_${widget.reference}`] ||
      questions[widget.reference]
    const isPracticeQuestion = itemLevelScoring
      ? every(questions, ({ validation }) => validation && validation.unscored)
      : get(question, 'validation.unscored', false)
    const prevQActivityForQuestion = previousQuestionActivity.find(
      (qa) => qa.qid === question?.id
    )
    let hintsUsed
    if (isLCBView || isExpressGrader) {
      if (itemLevelScoring) {
        const questionsList = Object.values(questions)
        if (questionsList.length) {
          hintsUsed = questionsList.some(
            ({ activity }) => activity?.hintsUsed?.length > 0
          )
        }
      } else {
        hintsUsed = !!question?.activity?.hintsUsed?.length > 0
      }
    }
    const testActivityId = question?.activity?.testActivityId

    return displayFeedback ? (
      <FeedbackWrapper
        showFeedback={showFeedback}
        displayFeedback={displayFeedback}
        isPrintPreview={isPrintPreview}
        isExpressGrader={isExpressGrader}
        isQuestionView={isQuestionView}
        showCollapseBtn={showCollapseBtn}
        prevQActivityForQuestion={prevQActivityForQuestion}
        data={{ ...question, isPracticeQuestion, smallSize: true }}
        isStudentReport={isStudentReport}
        isPresentationMode={isPresentationMode}
        shouldTakeDimensionsFromStore={shouldTakeDimensionsFromStore}
        studentId={studentId}
        studentName={studentName || t('common.anonymous')}
        itemId={itemId || itemIdKey || testItemId}
        key={`${testActivityId}_${index}`}
        ref={this.feedbackRef}
        hintsUsed={hintsUsed}
      />
    ) : null
  }

  renderFeedbacks = () => {
    const { cols, pageNumber, isDocBased, isQuestionView } = this.props
    const { value } = this.state
    let colIndex = 0
    return cols.map((col) => {
      const filteredWidgets = (col?.widgets || []).filter(
        (widget) =>
          widget.type !== questionType.SECTION_LABEL &&
          widget.widgetType !== 'resource'
      )
      const shouldShowPagination =
        isDocBased &&
        filteredWidgets.length > SCROLL_SHOW_LIMIT &&
        !isQuestionView
      const widgetsToRender = shouldShowPagination
        ? filteredWidgets.slice(
            LCB_LIMIT_QUESTION_PER_VIEW * (pageNumber - 1),
            LCB_LIMIT_QUESTION_PER_VIEW * pageNumber
          )
        : filteredWidgets
      return widgetsToRender.map((widget, i) => (
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
    })
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
      changedPlayerContent,
    } = this.props
    if (
      !scratchPadMode &&
      isPassageWithQuestions &&
      window.innerWidth < IPAD_LANDSCAPE_WIDTH &&
      (!isEqual(cols, preCols) || scratchPadMode !== prevProps.scratchPadMode)
    ) {
      this.setState(
        { toggleCollapseMode: true, collapseDirection: 'left' },
        () => {
          changedPlayerContent()
        }
      )
    } else if (
      scratchPadMode !== prevProps.scratchPadMode &&
      scratchPadMode &&
      !isLCBView
    ) {
      this.setState({ collapseDirection: '' }, () => {
        changedPlayerContent()
      })
    }
  }

  get showStackedView() {
    const {
      isLCBView,
      isQuestionView,
      multipartItem: v2Multipart,
      isPassageWithQuestions,
      itemLevelScoring,
      cols,
      isPrintPreview,
    } = this.props
    const isV1Multipart = (cols || []).some((col) => col.isV1Multipart)
    let showStackedView = false

    if (
      (isLCBView && !isQuestionView && !isPassageWithQuestions) ||
      isPrintPreview
    ) {
      if (
        !itemLevelScoring &&
        this.widgets.length > 1 &&
        (v2Multipart || isV1Multipart)
      ) {
        showStackedView = true
      }
    }

    return showStackedView
  }

  get widgets() {
    const { cols } = this.props
    return (cols || []).flatMap((col) => col?.widgets).filter((q) => q)
  }

  get isMultipartItem() {
    const { cols, multipartItem: v2Multipart } = this.props
    const isV1Multipart = (cols || []).some((col) => col.isV1Multipart)
    return v2Multipart || isV1Multipart
  }

  get isPassageInExpandedView() {
    const {
      cols,
      isExpandedView = false,
      isPassageWithMultipleQuestions = false,
    } = this.props
    return isPassageWithMultipleQuestions && isExpandedView && cols.length === 1
  }

  get colWidthValue() {
    const { collapseDirection } = this.state
    const { cols } = this.props

    if (this.isPassageInExpandedView) {
      return '50%'
    }
    return collapseDirection || cols.length == 1 ? '100%' : '50%'
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
      testActivityId,
      studentData,
      currentStudent,
      selectedTheme = 'default',
      ...restProps
    } = this.props
    const {
      isStudentReport,
      LCBPreviewModal,
      isLCBView,
      isReviewTab,
      isExpressGrader,
      isQuestionView,
      itemLevelScoring,
      isPrintPreview,
      isShowStudentWork,
      responsiveWidth,
    } = restProps

    const { isFeedbackVisible, collapseDirection } = this.state
    const { isStudentAttempt } = this.context

    const widgets = this.widgets

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
    const showCollapseButtons =
      hasResourceTypeQuestion &&
      showCollapseBtn &&
      this.isMultipartItem &&
      (cols || []).some((col) => col.dimension !== '100%')

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
          }}
          className="__print-item-fix-width"
        >
          <Container
            width={windowWidth}
            responsiveWidth={responsiveWidth}
            style={style}
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
                justifyContent: this.isPassageInExpandedView ? 'flex-end' : '',
              }}
            >
              {dataSource.map((col, i) => {
                const hideColumn =
                  (collapseDirection === 'left' && i === 0) ||
                  (collapseDirection === 'right' && i === 1)
                if (hideColumn && showCollapseButtons) return ''

                return (
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
                    colWidth={this.colWidthValue} // reverting layout changes as passage/multipart layout options view is broken in student view, LCB, EG | EV-28080
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
                    testActivityId={testActivityId}
                    studentData={studentData}
                    currentStudent={currentStudent}
                    themeBgColor={
                      selectedTheme === 'default' ? white : theme.themeColor
                    }
                  />
                )
              })}
            </div>
            {showCollapseButtons && this.renderCollapseButtons()}
          </Container>
        </div>
        {/* on the student side, show single feedback only when item level scoring is on */}
        {((itemLevelScoring && isStudentReport) ||
          (!isStudentReport && !isReviewTab)) &&
          (showFeedback ||
            (showPreviousAttempt !== 'NONE' &&
              isStudentAttempt &&
              !isStudentReport)) &&
          !isShowStudentWork &&
          !(isStudentAttempt && !itemLevelScoring) && (
            <>
              {!isCliUser && (
                <RenderFeedBack
                  isExpressGrader={isExpressGrader}
                  isPrintPreview={isPrintPreview}
                  isStudentAttempt={isStudentAttempt}
                  className="__print-feedback-main-wrapper testtest"
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
  isExpandedView: PropTypes.bool,
  isPassageWithMultipleQuestions: PropTypes.bool,
}

TestItemPreview.defaultProps = {
  showFeedback: false,
  verticalDivider: false,
  scrolling: false,
  style: { padding: 0, display: 'flex' },
  student: {},
  isExpandedView: false,
  isPassageWithMultipleQuestions: false,
}

const enhance = compose(
  React.memo,
  withWindowSizes,
  withTheme,
  withNamespaces('student'),
  connect(
    (state) => ({
      isCliUser: get(state, 'user.isCliUser', false),
      showPreviousAttempt: get(
        state,
        'test.settings.showPreviousAttempt',
        'NONE'
      ),
      pageNumber: getPageNumberSelector(state),
      testActivityId: get(state, 'test.testActivityId', ''),
      studentData: getUser(state),
      selectedTheme: state.ui.selectedTheme,
    }),
    {
      changedPlayerContent: changedPlayerContentAction,
      setPageNumber: setPageNumberAction,
    }
  )
)

export default enhance(TestItemPreview)
