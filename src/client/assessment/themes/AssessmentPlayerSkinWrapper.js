import React, { useState, useEffect, useContext } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { test } from '@edulastic/constants'
import { AssessmentPlayerContext, FlexContainer } from '@edulastic/common'
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
  themeForHeader = {},
  videoUrl,
  preventSectionNavigation,
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
    canUseImmersiveReader = false,
  } = restProps

  const isPadMode = windowWidth < IPAD_LANDSCAPE_WIDTH - 1
  let immersiveReaderTitle = ''
  const currentItemIndex = currentItem + 1
  if (typeof currentItemIndex === 'number' && restProps?.options?.length > 0) {
    immersiveReaderTitle = `Question ${currentItemIndex}/${restProps.options.length}`
  }

  const { blockNavigationToAnsweredQuestions = false } = restProps
  const { firstItemInSectionAndRestrictNav } = useContext(
    AssessmentPlayerContext
  )
  // Along with rest props need to add the context value for disabling back navigation in questions for first item in a section
  const navigationProps = {
    ...restProps,
    firstItemInSectionAndRestrictNav,
    immersiveReaderTitle,
    canUseImmersiveReader,
  }
  const handleRestrictQuestionBackNav = (e) => {
    e.preventDefault()
    if (blockNavigationToAnsweredQuestions || preventSectionNavigation) {
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
    if (blockNavigationToAnsweredQuestions || preventSectionNavigation) {
      window.addEventListener('popstate', handleRestrictQuestionBackNav)
    }
    return () => {
      if (blockNavigationToAnsweredQuestions || preventSectionNavigation) {
        window.removeEventListener('popstate', handleRestrictQuestionBackNav)
      }
    }
  }, [preventSectionNavigation])

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
          {...navigationProps}
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
          {...navigationProps}
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
          {...navigationProps}
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
          {...navigationProps}
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
          {...navigationProps}
          handleMagnifier={handleMagnifier}
        />
      )
    }
    if (defaultAP) {
      return (
        <DefaultAssessmentPlayerHeader
          {...navigationProps}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
        />
      )
    }
    return (
      <PracticePlayerHeader
        {...navigationProps}
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
          {...navigationProps}
          handleMagnifier={handleMagnifier}
          enableMagnifier={enableMagnifier}
          changeTool={toolToggleFunc}
          tool={tool}
        />
      )
    }
    if (playerSkinType === 'drc') {
      return <PlayerFooterDrc {...navigationProps} />
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
        marginTop: '82px',
      }
    }
    if (
      playerSkinType.toLowerCase() === test.playerSkinValues.sbac.toLowerCase()
    ) {
      return {
        paddingLeft: '10px',
        paddingRight: '10px',
        marginTop: '85px',
      }
    }
    if (
      playerSkinType.toLowerCase() ===
      test.playerSkinValues.quester.toLowerCase()
    ) {
      return {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: '65px',
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
            disabled={
              blockNavigationToAnsweredQuestions ||
              firstItemInSectionAndRestrictNav
            }
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
      <ThemeProvider theme={themeForHeader}>{header()}</ThemeProvider>
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
          !videoUrl &&
          navigationBtns()}
        <ThemeProvider theme={themeForHeader}>{footer()}</ThemeProvider>
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
    playerSkin.toLowerCase() === test.playerSkinValues.parcc.toLowerCase()
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
