import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { ScrollContext } from '@edulastic/common'
import { test } from '@edulastic/constants'
import TestItemPreview from '../../components/TestItemPreview'
import PlayerFooter from './PlayerFooter'
import { getEvaluationSelector } from '../../selectors/answers'
import getZoomedResponsiveWidth from '../../utils/zoomedResponsiveWidth'

const PlayerContentArea = ({
  itemRows,
  previewTab,
  currentItem,
  isFirst,
  isLast,
  moveToPrev,
  moveToNext,
  questions,
  t,
  unansweredQuestionCount,
  items,
  testItemState,
  setHighlights,
  setCrossAction,
  crossAction,
  previousQuestionActivities,
  playerSkinType = test.playerSkinValues.edulastic,
  isSidebarVisible = true,
  zoomLevel,
  windowWidth,
  scratchPadMode,
  saveUserWork,
  saveAttachments,
  attachments,
  history,
  evaluation,
  highlights,
  enableMagnifier,
  changePreview,
  blockNavigationToAnsweredQuestions = false,
}) => {
  const scrollContainerRef = useRef()
  const item = items[currentItem]
  const isZoomApplied = zoomLevel > 1
  const previousQuestionActivity = previousQuestionActivities[item._id]
  const responsiveWidth = getZoomedResponsiveWidth({
    windowWidth,
    diff: 290,
    zoomLevel,
  })

  return (
    <Main ref={scrollContainerRef} zoomed={isZoomApplied} zoomLevel={zoomLevel}>
      <ScrollContext.Provider
        value={{ getScrollElement: () => scrollContainerRef.current }}
      >
        <MainContent
          skin
          responsiveWidth={responsiveWidth}
          className="scrollable-main-wrapper"
        >
          {testItemState === '' && (
            <TestItemPreview
              crossAction={crossAction}
              setCrossAction={setCrossAction}
              setHighlights={setHighlights}
              cols={itemRows}
              previewTab={previewTab}
              questions={questions}
              previousQuestionActivity={previousQuestionActivity}
              showCollapseBtn
              highlights={highlights}
              scratchPadMode={scratchPadMode}
              saveUserWork={saveUserWork}
              userWork={history}
              saveAttachments={saveAttachments}
              attachments={attachments}
              viewComponent="practicePlayer"
              enableMagnifier={enableMagnifier}
              updateScratchpadtoStore
              testItemId={item._id}
            />
          )}
          {testItemState === 'check' && (
            <TestItemPreview
              cols={itemRows}
              previewTab="check"
              preview="check"
              questions={questions}
              highlights={highlights}
              previousQuestionActivity={previousQuestionActivity}
              showCollapseBtn
              scratchPadMode={scratchPadMode}
              saveUserWork={saveUserWork}
              userWork={history}
              saveAttachments={saveAttachments}
              attachments={attachments}
              viewComponent="practicePlayer"
              evaluation={evaluation}
              enableMagnifier={enableMagnifier}
              changePreviewTab={changePreview}
              testItemId={item._id}
            />
          )}
        </MainContent>
      </ScrollContext.Provider>
      {playerSkinType.toLowerCase() ===
        test.playerSkinValues.edulastic.toLowerCase() && (
        <PlayerFooter
          isLast={isLast}
          isFirst={isFirst}
          moveToNext={moveToNext}
          moveToPrev={moveToPrev}
          isSidebarVisible={isSidebarVisible}
          t={t}
          unansweredQuestionCount={unansweredQuestionCount}
          blockNavigationToAnsweredQuestions={
            blockNavigationToAnsweredQuestions
          }
        />
      )}
    </Main>
  )
}

PlayerContentArea.propTypes = {
  itemRows: PropTypes.array,
  previewTab: PropTypes.string.isRequired,
  currentItem: PropTypes.number.isRequired,
  isFirst: PropTypes.func.isRequired,
  isLast: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
}

PlayerContentArea.defaultProps = {
  itemRows: [],
}

const mapStateToProps = (state, props) => ({
  evaluation: getEvaluationSelector(state, props),
})

export default connect(mapStateToProps)(PlayerContentArea)

const Main = styled.main`
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.mainBgColor};
  display: flex;
  box-sizing: border-box;
  overflow: hidden;

  margin-top: 64px;
  padding: ${({ zoomed, zoomLevel }) => {
    if (zoomed) {
      if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
        return '20px'
      }
      if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
        return '15px'
      }
      if (zoomLevel >= 2.5) {
        return '10px'
      }
    }
    return '20px'
  }};
`

const MainContent = styled.div`
  z-index: 1;
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.mainContentBgColor};
  color: ${(props) =>
    props.theme.widgets.assessmentPlayers.mainContentTextColor};
  border-radius: 10px;
  font-size: 18px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  width: 100%;
  flex-direction: column;

  ${({ zoomLevel, responsiveWidth }) => {
    const zoomed = zoomLevel > 1 && zoomLevel !== undefined
    return `
      min-width: ${responsiveWidth}px;
      height: ${zoomed ? `${100 / zoomLevel}%` : '100%'};
      transform: ${zoomed ? `scale(${zoomLevel})` : ''};
      transform-origin: ${zoomed ? `top left` : ''};
    `
  }};
  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }
  position: relative;

  & input {
    user-select: text;
  }
`
