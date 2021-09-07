/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { test } from '@edulastic/constants'
import { IconSearch } from '@edulastic/icons'
import { TokenStorage } from '@edulastic/api'
import { notification } from '@edulastic/common'

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
import { currentItemAnswerChecksSelector } from '../../selectors/test'
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import { StyledIconCheck } from '../../../author/ContentBuckets/components/ContentBucketsTable/styled'

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
  hidePause,
  answerChecksUsedForItem,
  checkAnswer,
  checkAnswerInProgress,
  isPremiumContentWithoutAccess = false,
}) => {
  const isMobile = windowWidth <= MAX_MOBILE_WIDTH
  const { calcType } = settings

  const rightButtons = (
    <SaveAndExit
      previewPlayer={previewPlayer}
      finishTest={onOpenExitPopup}
      onSubmit={!previewPlayer ? onSubmit : null}
      utaId={utaId}
      hidePause={hidePause}
      groupId={groupId}
    />
  )

  const headerStyle = {
    height: '70px',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const hideCheckAnswer = !TokenStorage.getAccessToken()

  const handleCheckAnswer = () => {
    if (answerChecksUsedForItem >= settings.maxAnswerChecks) {
      return notification({
        type: 'warn',
        messageKey: 'checkAnswerLimitExceededForItem',
      })
    }

    checkAnswer(groupId)
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

                  {settings.maxAnswerChecks > 0 && !hideCheckAnswer && (
                    <Tooltip
                      placement="top"
                      title={
                        checkAnswerInProgress
                          ? 'In progress'
                          : answerChecksUsedForItem >= settings.maxAnswerChecks
                          ? 'Usage limit exceeded'
                          : 'Check Answer'
                      }
                    >
                      <ButtonWithStyle
                        onClick={handleCheckAnswer}
                        data-cy="checkAnswer"
                        disabled={
                          isPremiumContentWithoutAccess || checkAnswerInProgress
                        }
                      >
                        <StyledIconCheck />
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

const mapStateToProps = (state) => ({
  answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
  checkAnswerInProgress: state?.test?.checkAnswerInProgress,
})

const mapDispatchToProps = {
  checkAnswer: checkAnswerEvaluation,
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerHeader)
