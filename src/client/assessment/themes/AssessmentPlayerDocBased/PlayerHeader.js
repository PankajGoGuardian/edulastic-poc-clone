/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { test } from '@edulastic/constants'
import { IconSearch } from '@edulastic/icons'
import {
  Header,
  FlexContainer,
  LogoCompact,
  HeaderMainMenu,
  HeaderWrapper,
  SaveAndExit,
  MainActionWrapper,
} from '../common'
import { Tooltip } from '../../../common/utils/helpers'
import { Container, ButtonWithStyle, CaculatorIcon } from '../common/ToolBar'
import { MAX_MOBILE_WIDTH } from '../../constants/others'
import TimedTestTimer from '../common/TimedTestTimer'

const { calculatorTypes } = test

const PlayerHeader = ({
  title,
  onOpenExitPopup,
  windowWidth,
  onSubmit,
  previewPlayer,
  settings,
  currentToolMode,
  onChangeTool,
  handleMagnifier,
  enableMagnifier,
  showMagnifier,
  timedAssignment,
  utaId,
  groupId,
  hidePause
}) => {
  const isMobile = windowWidth <= MAX_MOBILE_WIDTH
  const { calcType } = settings

  const rightButtons = hidePause?null:(
    <SaveAndExit
      previewPlayer={previewPlayer}
      finishTest={onOpenExitPopup}
      onSubmit={!previewPlayer ? onSubmit : null}
      utaId={utaId}
      groupId={groupId}
    />
  );

  const headerStyle = {
    height: '70px',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  return (
    <>
      <Header>
        <HeaderMainMenu skinb="true">
          <FlexContainer>
            <HeaderWrapper headerStyle={headerStyle}>
              <LogoCompact
                isMobile={isMobile}
                buttons={rightButtons}
                title={title}
              />
              <MainActionWrapper>
                <Container>
                  {calcType !== calculatorTypes.NONE && (
                    <Tooltip placement="top" title="Calculator">
                      <ButtonWithStyle
                        active={currentToolMode.calculator}
                        onClick={() => onChangeTool('calculator')}
                      >
                        <CaculatorIcon />
                      </ButtonWithStyle>
                    </Tooltip>
                  )}
                  {showMagnifier && (
                    <Tooltip placement="top" title="Magnify">
                      <ButtonWithStyle
                        active={enableMagnifier}
                        onClick={handleMagnifier}
                      >
                        <IconSearch />
                      </ButtonWithStyle>
                    </Tooltip>
                  )}
                  {timedAssignment && (
                    <TimedTestTimer utaId={utaId} groupId={groupId} />
                  )}
                </Container>
              </MainActionWrapper>
              {!isMobile && rightButtons}
            </HeaderWrapper>
          </FlexContainer>
        </HeaderMainMenu>
      </Header>
    </>
  )
}

PlayerHeader.defaultProps = {
  onSaveProgress: () => {},
}

export default PlayerHeader
