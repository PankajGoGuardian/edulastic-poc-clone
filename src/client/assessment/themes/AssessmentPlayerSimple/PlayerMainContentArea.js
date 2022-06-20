import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { test } from '@edulastic/constants'
import TestItemPreview from '../../components/TestItemPreview'
import ReferenceDocModal from '../common/ReferenceDocModal'
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
  tool,
  premiumCollectionWithoutAccess,
  isPremiumContentWithoutAccess,
  referenceDocAttributes,
  isShowReferenceModal,
  saveHintUsageData,
  classLevelSettings,
  viewAsStudent,
}) => {
  const item = items[currentItem]
  const previousQuestionActivity = previousQuestionActivities[item._id]
  const responsiveWidth = getZoomedResponsiveWidth({
    windowWidth,
    diff: 290,
    zoomLevel,
  })
  const extraTestItemProps =
    testItemState === 'check'
      ? {
          evaluation,
          previewTab: 'check',
          preview: 'check',
          changePreviewTab: changePreview,
        }
      : {
          previewTab,
          crossAction,
          setCrossAction,
          setHighlights,
        }

  const saveHintUsage = (hintUsage) => {
    if (item?._id) {
      saveHintUsageData({
        itemId: item._id,
        hintUsage,
      })
    }
  }

  return (
    <Main>
      <MainContent>
        <TestItemPreview
          isExpandedView
          showCollapseBtn
          cols={itemRows}
          questions={questions}
          highlights={highlights}
          previousQuestionActivity={previousQuestionActivity}
          scratchPadMode={scratchPadMode}
          saveUserWork={saveUserWork}
          userWork={history}
          saveAttachments={saveAttachments}
          attachments={attachments}
          viewComponent="practicePlayer"
          enableMagnifier={enableMagnifier}
          testItemId={item._id}
          tool={tool}
          zoomLevel={zoomLevel}
          responsiveWidth={responsiveWidth}
          isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
          premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
          saveHintUsage={saveHintUsage}
          classLevelSettings={classLevelSettings}
          viewAsStudent={viewAsStudent}
          {...extraTestItemProps}
        />
      </MainContent>
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
      {isShowReferenceModal && referenceDocAttributes && (
        <ReferenceDocModal
          attributes={referenceDocAttributes}
          playerSkinType={playerSkinType}
          zoomLevel={zoomLevel}
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
  padding: 20px;
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

  & * {
    -webkit-touch-callout: none;
    user-select: none;
  }
  position: relative;

  & input {
    user-select: text;
  }
`
