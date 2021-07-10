import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { test } from '@edulastic/constants'
import FlashCards from './FlashCards'
import FlipCards from './FlipCards'

import { getEvaluationSelector } from '../../selectors/answers'
import getZoomedResponsiveWidth from '../../utils/zoomedResponsiveWidth'
import Confetti from 'react-dom-confetti'
import { ConfettiContainer } from './styled'
import FlashQuizReport from './FlashQuizReport'

const config = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 600,
  dragFriction: 0.12,
  duration: 5000,
  stagger: 3,
  width: '10px',
  height: '10px',
  perspective: '500px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
}

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
  flashQuizPhase,
  setPhase,
  user,
}) => {
  const [isExploding, setIsExploding] = React.useState(false)

  const scrollContainerRef = useRef()
  const isZoomApplied = zoomLevel > 1
  const responsiveWidth = getZoomedResponsiveWidth({
    windowWidth,
    diff: 290,
    zoomLevel,
  })

  return (
    <Main ref={scrollContainerRef} zoomed={isZoomApplied} zoomLevel={zoomLevel}>
      <MainContent
        skin
        zoomLevel={zoomLevel}
        responsiveWidth={responsiveWidth}
        className="scrollable-main-wrapper"
      >
        {flashQuizPhase === 1 && <FlashCards setPhase={setPhase} />}
        {flashQuizPhase === 2 && (
          <FlipCards setIsExploding={setIsExploding} setPhase={setPhase} />
        )}
        {flashQuizPhase === 3 && <FlashQuizReport user={user} />}
        <ConfettiContainer>
          <Confetti active={isExploding} config={config} />
        </ConfettiContainer>
      </MainContent>
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
