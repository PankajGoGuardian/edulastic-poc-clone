/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FlexContainer, withWindowSizes } from '@edulastic/common'

import { Header, HeaderMainMenu, SaveAndExit, LogoCompact } from '../common'

import { MAX_MOBILE_WIDTH } from '../../constants/others'

import { HeaderTitle } from './styled'

const PlayerHeader = ({
  title,
  windowWidth,
  headerRef,
  previewPlayer,
  timedAssignment,
  utaId,
  groupId,
  hidePause,
  phase = 1,
  history,
}) => {
  const handleSaveNExit = () => history.push('/home/assignments')

  const rightButtons = (
    <SaveAndExit
      utaId={utaId}
      groupId={groupId}
      previewPlayer={previewPlayer}
      showZoomBtn
      hidePause={hidePause}
      finishTest={handleSaveNExit}
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
    (state) => ({
      settings: state.test.settings,
    }),
    null
  )
)

export default enhance(PlayerHeader)
