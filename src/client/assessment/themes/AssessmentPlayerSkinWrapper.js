import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { test } from '@edulastic/constants'
import { FlexContainer } from '@edulastic/common'
import { drcThemeColor } from '@edulastic/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import PracticePlayerHeader from './AssessmentPlayerSimple/PlayerHeader'
import DocBasedPlayerHeader from './AssessmentPlayerDocBased/PlayerHeader'
import DefaultAssessmentPlayerHeader from './AssessmentPlayerDefault/PlayerHeader'
import ParccHeader from './skins/Parcc/PlayerHeader'
import SidebarQuestionList from './AssessmentPlayerSimple/PlayerSideBar'
import { IPAD_LANDSCAPE_WIDTH } from '../constants/others'
import { Nav } from './common'
import PlayerFooter from './skins/Quester/PlayerFooter'
import QuesterHeader from './skins/Quester/PlayerHeader'
import SbacHeader from './skins/Sbac/PlayerHeader'
import PlayerFooterDrc from './skins/Drc/PlayerFooter'
import DrcHeader from './skins/Drc/PlayerHeader'
import Magnifier from '../../common/components/Magnifier'
import { Tooltip } from '../../common/utils/helpers'

const AssessmentPlayerSkinWrapper = ({
  children,
  defaultAP,
  docUrl,
  playerSkinType = test.playerSkinValues.edulastic,
  originalSkinName,
  handleMagnifier,
  enableMagnifier = false,
  ...restProps
}) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)
  const {
    moveToNext,
    moveToPrev,
    changeTool,
    currentItem,
    windowWidth,
    toggleToolsOpenStatus,
    hasDrawingResponse,
    isShowStudentWork,
  } = restProps

  const isPadMode = windowWidth < IPAD_LANDSCAPE_WIDTH - 1

  const { blockNavigationToAnsweredQuestions = false } = restProps

  const handleRestrictQuestionBackNav = (e) => {
    e.preventDefault()
    if (blockNavigationToAnsweredQuestions) {
      const matched = e.target.location.pathname.match(
        new RegExp('/student/(assessment|practice)/.*/class/.*/uta/.*/.*')
      )
      if (matched) {
        window.history.go(1)
        return false
      }
    }
  }

  useEffect(() => {
    if (blockNavigationToAnsweredQuestions) {
      window.addEventListener('popstate', handleRestrictQuestionBackNav)
      return () =>
        window.removeEventListener('popstate', handleRestrictQuestionBackNav)
    }
  }, [])

  useEffect(() => {
    const toolToggleFunc = toggleToolsOpenStatus || changeTool
    // 5 is Scratchpad mode
    if (hasDrawingResponse && toolToggleFunc) {
      toolToggleFunc(5)
    }
  }, [currentItem])

  useEffect(() => {
    setSidebarVisible(!isPadMode)
  }, [windowWidth])

  const toggleSideBar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  const isDocBased = !!docUrl

  const header = () => {
    if (playerSkinType === 'parcc') {
      return (
        <ParccHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={isDocBased}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      )
    }
    if (playerSkinType == 'sbac') {
      return (
        <SbacHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={isDocBased}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      )
    }
    if (playerSkinType === 'quester') {
      return (
        <QuesterHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={isDocBased}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      )
    }
    if (playerSkinType === 'drc') {
      const toolToggleFunc = toggleToolsOpenStatus || changeTool
      const tool = restProps.toolsOpenStatus || restProps.tool
      return (
        <DrcHeader
          {...restProps}
          options={restProps.options || restProps.dropdownOptions}
          defaultAP={defaultAP}
          isDocbased={isDocBased}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
          changeTool={toolToggleFunc}
          tool={tool}
        />
      )
    }
    if (docUrl || docUrl === '') {
      return (
        <DocBasedPlayerHeader
          {...restProps}
          handleMagnifier={handleMagnifier}
        />
      )
    }
    if (defaultAP) {
      return (
        <DefaultAssessmentPlayerHeader
          {...restProps}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      )
    }
    return (
      <PracticePlayerHeader
        {...restProps}
        handleMagnifier={handleMagnifier}
        enableMagnifier={enableMagnifier}
      />
    )
  }

  const footer = () => {
    if (playerSkinType === 'quester') {
      const toolToggleFunc = toggleToolsOpenStatus || changeTool
      const tool = restProps.toolsOpenStatus || restProps.tool
      return (
        <PlayerFooter
          {...restProps}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
          changeTool={toolToggleFunc}
          tool={tool}
        />
      )
    }
    if (playerSkinType === 'drc') {
      return <PlayerFooterDrc {...restProps} />
    }
    return null
  }

  const leftSideBar = () => {
    if (!defaultAP && !isDocBased) {
      return (
        <Sidebar isVisible={isSidebarVisible}>
          <SidebarQuestionList
            questions={restProps.dropdownOptions}
            selectedQuestion={restProps.currentItem}
            gotoQuestion={restProps.gotoQuestion}
            toggleSideBar={toggleSideBar}
            isSidebarVisible={isSidebarVisible}
            theme={restProps.theme}
            blockNavigationToAnsweredQuestions={
              blockNavigationToAnsweredQuestions
            }
          />
        </Sidebar>
      )
    }
    return null
  }

  const getMainContainerStyle = () => {
    if (
      playerSkinType.toLowerCase() ===
      test.playerSkinValues.edulastic.toLowerCase()
    ) {
      return {
        width: '100%',
      }
    }
    if (
      playerSkinType.toLowerCase() === test.playerSkinValues.parcc.toLowerCase()
    ) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: defaultAP ? '82px' : '68px',
      }
    }
    if (
      playerSkinType.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()
    ) {
      return {
        paddingLeft: defaultAP ? 0 : '10px',
        paddingRight: defaultAP ? 0 : '10px',
        marginTop: defaultAP ? '78px' : '68px',
      }
    }
    if (
      playerSkinType.toLowerCase() ===
      test.playerSkinValues.quester.toLowerCase()
    ) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '48px',
      }
    }
    if (
      playerSkinType.toLowerCase() === test.playerSkinValues.drc.toLowerCase()
    ) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
      }
    }
    return { width: '100%' }
  }

  const getStyle = () => {
    if (
      playerSkinType.toLowerCase() ===
      test.playerSkinValues.edulastic.toLowerCase()
    ) {
      if (isDocBased || defaultAP) {
        return { width: '100%' }
      }
      return {
        width: isSidebarVisible ? 'calc(100% - 220px)' : 'calc(100%)',
        marginLeft: isSidebarVisible ? '220px' : '0px',
        background: restProps.theme.widgets.assessmentPlayers.mainBgColor,
      }
    }
    if (
      playerSkinType.toLowerCase() ===
        test.playerSkinValues.parcc.toLowerCase() ||
      playerSkinType.toLowerCase() ===
        test.playerSkinValues.sbac.toLowerCase() ||
      playerSkinType.toLowerCase() ===
        test.playerSkinValues.quester.toLowerCase() ||
      playerSkinType.toLowerCase() === test.playerSkinValues.drc.toLowerCase()
    ) {
      return {
        width: '100%',
      }
    }
    return {}
  }

  const navigationBtns = () => (
    <>
      {currentItem > 0 && (
        <Tooltip
          placement="right"
          title={
            blockNavigationToAnsweredQuestions
              ? 'This assignment is restricted from navigating back to the previous question.'
              : 'Previous'
          }
        >
          <Nav.BackArrow
            left="0px"
            borderRadius="0px"
            width="30"
            onClick={blockNavigationToAnsweredQuestions ? () => {} : moveToPrev}
            disabled={blockNavigationToAnsweredQuestions}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </Nav.BackArrow>
        </Tooltip>
      )}
      <Tooltip placement="left" title="Next">
        <Nav.NextArrow
          right="0px"
          borderRadius="0px"
          width="30"
          onClick={moveToNext}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Nav.NextArrow>
      </Tooltip>
    </>
  )

  const getTopOffset = () => {
    if (
      playerSkinType.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()
    ) {
      return { top: 120, left: 0 }
    }
    return { top: 63, left: 0 }
  }

  return (
    <Magnifier enable={enableMagnifier} offset={getTopOffset()}>
      {header()}
      <FlexContainer position="relative">
        <StyledMainContainer
          mainContainerStyle={getMainContainerStyle()}
          style={getStyle()}
          playerSkin={playerSkinType}
          isSidebarVisible={isSidebarVisible}
          data-cy={test.playerSkinTypes[originalSkinName]}
        >
          {children}
        </StyledMainContainer>
        {playerSkinType.toLowerCase() ===
          test.playerSkinValues.edulastic.toLowerCase() && leftSideBar()}
        {playerSkinType.toLowerCase() ===
          test.playerSkinValues.edulastic.toLowerCase() &&
          defaultAP &&
          !isShowStudentWork &&
          navigationBtns()}
        {footer()}
      </FlexContainer>
    </Magnifier>
  )
}

const Sidebar = styled.div`
  position: absolute;
  left: 0;
  width: ${({ isVisible }) => (isVisible ? 220 : 0)}px;
  background-color: ${(props) =>
    props.theme.widgets.assessmentPlayers.sidebarBgColor};
  color: ${(props) => props.theme.widgets.assessmentPlayers.sidebarTextColor};
  padding-top: 64px;
  transition: all 0.3s ease;
`

const StyledMainContainer = styled.div`
  main {
    .jsx-parser {
      p {
        margin-bottom: 0.25rem;
        line-height: 1.2;
      }
    }
    ${({ mainContainerStyle }) => mainContainerStyle};
    .practice-player-footer {
      left: ${({ isSidebarVisible }) => (isSidebarVisible ? '220px' : '0px')};
    }
    .question-tab-container {
      height: fit-content !important;
    }
  }
  ${({ playerSkin }) =>
    playerSkin.toLowerCase() === test.playerSkinValues.parcc.toLowerCase() ||
    playerSkin.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()
      ? `
    .question-tab-container {
      padding-top: 0!important;
      height: fit-content!important;
    }
    .scratchpad-tools {
      top: 130px;
    }
    .question-audio-controller {
      display: ${
        playerSkin.toLowerCase() === test.playerSkinValues.parcc.toLowerCase()
          ? 'block'
          : 'none!important'
      };
      z-index: 1;
      position: absolute;
      top: 50%;
      right: 0px;
      > div {
        display: flex!important;
        flex-direction: column;
      }
      button {
        background: #EEEEEE!important;
        margin-bottom: 5px;
        svg {
          fill: #7A7A7A;
        }
      }
    }
  `
      : playerSkin.toLowerCase() === test.playerSkinValues.drc.toLowerCase()
      ? `
      .question-audio-controller {
        display: flex;
        padding: 5px 10px;
        button.ant-btn.ant-btn-primary{
          background-color: ${drcThemeColor};
          border-color: ${drcThemeColor};
        }
      }
      `
      : ``}
`
export default AssessmentPlayerSkinWrapper
