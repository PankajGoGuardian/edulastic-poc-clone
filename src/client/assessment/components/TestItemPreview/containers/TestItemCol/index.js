import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, AnswerContext } from '@edulastic/common'
import { questionType } from '@edulastic/constants'
import { isEmpty, sortBy } from 'lodash'

import { MAX_MOBILE_WIDTH } from '../../../../constants/others'

import QuestionWrapper from '../../../QuestionWrapper'
import {
  Scratchpad,
  ScratchpadTool,
} from '../../../../../common/components/Scratchpad'
import { Container, WidgetContainer } from './styled/Container'
import { MobileRightSide } from './styled/MobileRightSide'
import { MobileLeftSide } from './styled/MobileLeftSide'
import { IconArrow } from './styled/IconArrow'
import TabContainer from './TabContainer'

class TestItemCol extends Component {
  constructor() {
    super()
    this.state = {
      value: 0,
    }
  }

  handleTabChange = (value) => {
    this.setState({
      value,
    })
  }

  renderTabContent = (
    widget,
    flowLayout,
    widgetIndex,
    showStackedView,
    lengthOfwidgets
  ) => {
    const {
      preview,
      showFeedback,
      multiple,
      questions,
      qIndex,
      evaluation,
      previousQuestionActivity = [],
      previewTab,
      col,
      isDocBased,
      testReviewStyle = {},
      teachCherFeedBack,
      itemLevelScoring,
      isPassageWithQuestions,
      hasDrawingResponse,
      ...restProps
    } = this.props
    const {
      LCBPreviewModal,
      isStudentAttempt,
      isStudentReport,
      isLCBView,
    } = restProps
    const timespent = widget.timespent !== undefined ? widget.timespent : null
    const question = questions[widget.reference]
    const prevQActivityForQuestion = previousQuestionActivity.find(
      (qa) => qa.qid === question.id
    )
    const { fullHeight } = restProps
    if (!question) {
      return <div />
    }

    if (question.activity && question.activity.filtered) {
      return <div />
    }

    const displayFeedback = true
    let minHeight = null
    if (
      multiple &&
      widget.widgetType === 'question' &&
      (isLCBView || showStackedView || isDocBased || isStudentAttempt)
    ) {
      // we shows multiple feedback in multiple question type
      // when scoring type is question level.
      // feedback wrapper is required minHeight 320 at least
      minHeight = '320px'
    }

    return (
      <TabContainer
        updatePositionToStore={
          (showStackedView ||
            isDocBased ||
            (isPassageWithQuestions && !itemLevelScoring)) &&
          widget.widgetType === 'question'
        }
        questionId={widget.reference}
        fullHeight={fullHeight}
        testReviewStyle={testReviewStyle}
        minHeight={minHeight}
        itemIndex={widgetIndex}
        marginTop={widgetIndex > 0 && lengthOfwidgets > 1 ? 20 : ''}
        showBorder={!hasDrawingResponse && isLCBView}
      >
        <QuestionWrapper
          showFeedback={showFeedback && widget?.widgetType !== 'resource'}
          evaluation={evaluation}
          multiple={multiple}
          type={widget.type}
          view="preview"
          qIndex={qIndex}
          itemIndex={widgetIndex}
          previewTab={previewTab || preview}
          timespent={timespent}
          questionId={widget.reference}
          data={{ ...question, smallSize: true }}
          noPadding
          noBoxShadow
          isFlex
          flowLayout={flowLayout}
          prevQActivityForQuestion={prevQActivityForQuestion}
          LCBPreviewModal={LCBPreviewModal}
          displayFeedback={displayFeedback}
          calculatedHeight={showStackedView || fullHeight ? '100%' : 'auto'}
          fullMode
          {...restProps}
          hasDrawingResponse={hasDrawingResponse}
          style={{ ...testReviewStyle, width: 'calc(100% - 256px)' }}
          // widgetIndex was needed for passages if it has multiple tabs and widgets
          widgetIndex={widgetIndex}
        />
        {/* on the student side, show feedback for each question
        only when item level scoring is off */}
        {isStudentReport &&
          !itemLevelScoring &&
          teachCherFeedBack(widget, null, null, showStackedView)}
      </TabContainer>
    )
  }

  get readyOnlyScratchpad() {
    const { isLCBView, isStudentReport, LCBPreviewModal } = this.props
    const readyOnlyScratchpad = isStudentReport || isLCBView || LCBPreviewModal

    return readyOnlyScratchpad
  }

  get showScratchpad() {
    const {
      hasDrawingResponse,
      scratchPadMode,
      colIndex,
      colCount,
      col,
      isPrintPreview,
      isLCBView,
      isStudentAttempt,
      isExpressGrader,
      userWork: scratchpadData,
      disableResponse: isAnswerModifiable,
    } = this.props
    const widgets =
      (col?.tabs && !!col?.tabs?.length && isPrintPreview
        ? sortBy(col?.widgets, ['tabIndex'])
        : col?.widgets) || []
    const hasResourceTypeQuestion = widgets.find(
      (item) => item && item.widgetType === 'resource'
    )
    const shouldHideScratchpad = isLCBView && !!hasResourceTypeQuestion
    // only show scratchpad in right panel and signle panel
    let showScratchpad =
      (scratchPadMode && colIndex === 1 && colCount > 1) ||
      (scratchPadMode && colCount === 1)
    // for drawing response, will render scratchpad in question component
    showScratchpad =
      showScratchpad && !shouldHideScratchpad && !hasDrawingResponse

    // teacher view (LCB, ExpressGrader, etc)
    if (!isStudentAttempt && showScratchpad) {
      if (isExpressGrader && !isAnswerModifiable) {
        // in ExpressGrade modal with editing response on,
        // we will show scratchpad even though there is no data
        return showScratchpad
      }
      // render scratchpad only if there is data.
      return !isEmpty(scratchpadData)
    }

    // student view
    return showScratchpad
  }

  get showScratchToolBar() {
    const {
      hasDrawingResponse,
      scratchPadMode,
      LCBPreviewModal,
      disableResponse,
      isExpressGrader,
    } = this.props
    let showScratchToolBar =
      (scratchPadMode && !LCBPreviewModal && !hasDrawingResponse) ||
      (!disableResponse && isExpressGrader && !hasDrawingResponse)
    showScratchToolBar =
      this.showScratchpad && showScratchToolBar && !this.readyOnlyScratchpad

    return showScratchToolBar
  }

  render() {
    const {
      col,
      style,
      windowWidth,
      colCount,
      colIndex,
      isPassageWithQuestions,
      colWidth,
      userWork,
      saveUserWork,
      ...restProps
    } = this.props
    const { value } = this.state
    const {
      showStackedView,
      scratchpadDimensions,
      isPrintPreview,
      isStudentAttempt,
      isExpressGrader,
      isStudentReport,
    } = restProps

    const widgets =
      (col?.tabs && !!col?.tabs?.length && isPrintPreview
        ? sortBy(col?.widgets, ['tabIndex'])
        : col?.widgets) || []

    return (
      <Container
        style={style}
        value={value}
        colWidth={colWidth}
        showScratchpad={this.showScratchpad}
        isStudentAttempt={isStudentAttempt}
        isExpressGrader={isExpressGrader}
        isStudentReport={isStudentReport}
        className={`test-item-col ${
          col?.tabs?.length ? 'test-item-tab-container' : ''
        }`}
      >
        {this.showScratchToolBar && <ScratchpadTool />}
        {!isPrintPreview && (
          <>
            {col.tabs && !!col.tabs.length && windowWidth >= MAX_MOBILE_WIDTH && (
              <Tabs value={value} onChange={this.handleTabChange}>
                {col.tabs.map((tab, tabIndex) => (
                  <Tabs.Tab
                    key={tabIndex}
                    label={tab}
                    style={{
                      width: `calc(${100 / col.tabs.length}% - 10px)`,
                      textAlign: 'center',
                      padding: '5px 15px',
                    }}
                    {...restProps}
                  />
                ))}
              </Tabs>
            )}
            {col.tabs &&
              windowWidth < MAX_MOBILE_WIDTH &&
              !!col.tabs.length &&
              value === 0 && (
                <MobileRightSide onClick={() => this.handleTabChange(1)}>
                  <IconArrow type="left" />
                </MobileRightSide>
              )}
            {col.tabs &&
              windowWidth < MAX_MOBILE_WIDTH &&
              !!col.tabs.length &&
              value === 1 && (
                <MobileLeftSide onClick={() => this.handleTabChange(0)}>
                  <IconArrow type="right" />
                </MobileLeftSide>
              )}
          </>
        )}
        <WidgetContainer data-cy="widgetContainer">
          {widgets
            .filter((widget) => widget.type !== questionType.SECTION_LABEL)
            .map((widget, i, arr) => (
              <React.Fragment key={i}>
                {col.tabs &&
                  !!col.tabs.length &&
                  value === widget.tabIndex &&
                  !isPrintPreview &&
                  this.renderTabContent(
                    widget,
                    col.flowLayout,
                    i,
                    showStackedView,
                    arr.length
                  )}
                {col.tabs &&
                  !!col.tabs.length &&
                  isPrintPreview &&
                  this.renderTabContent(
                    widget,
                    col.flowLayout,
                    i,
                    showStackedView,
                    arr.length
                  )}
                {col.tabs &&
                  !col.tabs.length &&
                  this.renderTabContent(
                    widget,
                    col.flowLayout,
                    i,
                    showStackedView,
                    arr.length
                  )}
              </React.Fragment>
            ))}
          {this.showScratchpad && (
            <Scratchpad
              hideTools
              data={userWork}
              saveData={saveUserWork}
              readOnly={this.readyOnlyScratchpad}
              conatinerWidth={colWidth}
              dimensions={scratchpadDimensions}
            />
          )}
        </WidgetContainer>
      </Container>
    )
  }
}

TestItemCol.propTypes = {
  col: PropTypes.object.isRequired,
  preview: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired,
  showFeedback: PropTypes.bool,
  multiple: PropTypes.bool,
  style: PropTypes.object,
  questions: PropTypes.object.isRequired,
  qIndex: PropTypes.number,
  LCBPreviewModal: PropTypes.bool.isRequired,
  evaluation: PropTypes.object,
  previousQuestionActivity: PropTypes.array,
  previewTab: PropTypes.string.isRequired,
  isDocBased: PropTypes.bool,
  colCount: PropTypes.number.isRequired,
  colIndex: PropTypes.number.isRequired,
}

TestItemCol.defaultProps = {
  showFeedback: false,
  multiple: false,
  style: {},
  qIndex: null,
  previousQuestionActivity: [],
  isDocBased: false,
  evaluation: {},
}

TestItemCol.contextType = AnswerContext

export default TestItemCol
