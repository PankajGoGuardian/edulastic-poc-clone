/* eslint-disable react/prop-types */
import {
  IconBookmark,
  IconMinusRounded,
  IconPlus,
  IconClose,
  IconScratchPad,
  IconCalculator,
} from '@edulastic/icons'
import React, { useState } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { test as testConstants } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import questionType from '@edulastic/constants/const/questionType'
import { setZoomLevelAction } from '../../../../student/Sidebar/ducks'

const zoomIndex = [1, 1.5, 1.75, 2.5, 3]

const CALC = 2
const CROSS_BUTTON = 3
const SCRATCHPAD = 5

const PlayerFooter = ({
  setZoomLevel,
  blockNavigationToAnsweredQuestions,
  defaultAP,
  toggleBookmark,
  currentItem,
  items,
  isBookmarked,
  t,
  changeTool,
  tool,
  qType,
  hasDrawingResponse,
  settings,
}) => {
  const [zoom, setZoom] = useState(0)
  const { calcType, enableScratchpad } = settings
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE

  const handleZoomIn = () => {
    if (zoom !== zoomIndex.length - 1) {
      setZoomLevel(zoomIndex[zoom + 1])
      setZoom(zoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (zoom !== 0) {
      setZoomLevel(zoomIndex[zoom - 1])
      setZoom(zoom - 1)
    }
  }

  return (
    <MainFooter isSidebarVisible className="quester-player-footer">
      <ActionContainer>
        <PlusOrMinus>
          <IconWrap className="hover-effect" onClick={handleZoomOut}>
            <IconMinusRounded color="#fff" />
          </IconWrap>
          <Devider />
          <IconWrap className="hover-effect" onClick={handleZoomIn}>
            <IconPlus color="#fff" />
          </IconWrap>
        </PlusOrMinus>
        <div>Zoom</div>
      </ActionContainer>
      {!blockNavigationToAnsweredQuestions && (
        <ActionContainer
          hoverEffect
          onClick={
            defaultAP
              ? toggleBookmark
              : () => toggleBookmark(items[currentItem]?._id)
          }
        >
          <IconWrapper>
            <IconBookmark
              color={isBookmarked ? '#a2d8fd' : '#fff'}
              hoverColor="#a2d8fd"
            />
          </IconWrapper>

          <span>{t('common.test.bookmark')}</span>
        </ActionContainer>
      )}
      <Devider />
      <ActionContainer
        hoverEffect
        active={tool.includes(CROSS_BUTTON)}
        onClick={() => changeTool(CROSS_BUTTON)}
        disabled={isDisableCrossBtn}
      >
        <IconWrapper>
          <IconClose color="#fff" hoverColor="#a2d8fd" />
        </IconWrapper>

        <span>{t('common.test.answerEliminator')}</span>
      </ActionContainer>
      {calcType !== testConstants.calculatorTypes.NONE && (
        <ActionContainer
          hoverEffect
          active={tool.includes(CALC)}
          onClick={() => changeTool(CALC)}
        >
          <IconWrapper>
            <IconCalculator color="#fff" hoverColor="#a2d8fd" />
          </IconWrapper>

          <span>{t('common.test.calculator')}</span>
        </ActionContainer>
      )}
      {enableScratchpad && !hasDrawingResponse && (
        <ActionContainer
          hoverEffect
          active={tool.includes(SCRATCHPAD)}
          onClick={() => changeTool(SCRATCHPAD)}
        >
          <IconWrapper>
            <IconScratchPad color="#fff" hoverColor="#a2d8fd" />
          </IconWrapper>

          <span>{t('common.test.scratchPad')}</span>
        </ActionContainer>
      )}
    </MainFooter>
  )
}

// export default PlayerFooter
const enhance = compose(
  withNamespaces('student'),
  connect(null, {
    setZoomLevel: setZoomLevelAction,
  })
)

export default enhance(PlayerFooter)

const MainFooter = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  padding: 0 15px;
  z-index: 2;
  background: #334049;
  border-top: 1px solid #2b2b2b;
  color: #fff;
  font-size: 13px;
`

const ActionContainer = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 8px 15px;
  ${(props) =>
    props.active &&
    `
      background-color: #40505b;
      color: #a2d8fd;
      cursor: pointer;
    `}
  ${(props) =>
    props.hoverEffect &&
    `
      &:hover{
        background-color: #40505b;
        color: #a2d8fd;
        cursor: pointer;
      }
    `}
`

const PlusOrMinus = styled.div`
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  overflow: hidden;
`

const IconWrap = styled.span`
  padding: 5px 20px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  &:hover {
    background-color: #40505b;
    color: #a2d8fd;
  }
`
const Devider = styled.div`
  width: 1px;
  background: #fff;
`

const IconWrapper = styled.div`
  cursor: pointer;
`
