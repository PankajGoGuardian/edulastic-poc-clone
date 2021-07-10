/* eslint-disable react/prop-types */
import React, { Fragment, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import styled from 'styled-components'
import { nonAutoGradableTypes } from '@edulastic/constants'
import { FlexContainer, withWindowSizes } from '@edulastic/common'
import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import { Tooltip, isZoomGreator } from '../../../common/utils/helpers'

import {
  Header,
  HeaderWrapper,
  HeaderMainMenu,
  TestButton,
  ToolButton,
  SaveAndExit,
  LogoCompact,
  ToolBar,
  ToolTipContainer,
  MainActionWrapper,
} from '../common'

import { MAX_MOBILE_WIDTH, IPAD_LANDSCAPE_WIDTH } from '../../constants/others'

import { HeaderTitle } from './styled'
import QuestionSelectDropdown from '../common/QuestionSelectDropdown'

import ToolbarModal from '../common/ToolbarModal'

const PlayerHeader = ({
  title,
  dropdownOptions,
  currentItem,
  onOpenExitPopup,
  theme,
  gotoQuestion,
  settings,
  windowWidth,
  items,
  answerChecksUsedForItem,
  checkAnswer,
  toggleBookmark,
  isBookmarked,
  onshowHideHints,
  toggleToolsOpenStatus,
  toolsOpenStatus,
  headerRef,
  previewPlayer,
  handleMagnifier,
  enableMagnifier,
  toggleUserWorkUploadModal,
  timedAssignment,
  utaId,
  groupId,
  hidePause,
  blockNavigationToAnsweredQuestions,
  LCBPreviewModal = false,
  phase = 1,
}) => {
  const rightButtons = (
    <SaveAndExit
      utaId={utaId}
      groupId={groupId}
      previewPlayer={previewPlayer}
      showZoomBtn
      hidePause={hidePause}
      finishTest={onOpenExitPopup}
      timedAssignment={timedAssignment}
    />
  )

  const isMobile = windowWidth <= MAX_MOBILE_WIDTH

  return (
    <Header ref={headerRef}>
      <HeaderMainMenu skinb="true">
        <FlexContainer
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          mt="10px"
          marginBottom="10px"
        >
          <LogoCompact
            isMobile={isMobile}
            buttons={rightButtons}
            title={title}
          />
          <HeaderTitle>
            {phase === 1 && 'FlashQuiz | Learn & Memorize'}
            {phase === 2 && 'FlashQuiz | Assessment'}
            {phase === 3 && 'FlashQuiz | Report'}
          </HeaderTitle>
          {!isMobile && rightButtons}
        </FlexContainer>
      </HeaderMainMenu>
    </Header>
  )
}

PlayerHeader.defaultProps = {
  onSaveProgress: () => {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state, { timedAssignment }) => ({
      settings: state.test.settings,
      timedAssignment: timedAssignment || state.test?.settings?.timedAssignment,
    }),
    null
  )
)

export default enhance(PlayerHeader)

const HeaderPracticePlayer = styled(FlexContainer)`
  padding: 12px 0px;
  justify-content: space-between;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 11px 0px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 8.5px 0px;
  }
  @media (max-width: ${MAX_MOBILE_WIDTH}px) {
    padding: 0px;
  }
`
