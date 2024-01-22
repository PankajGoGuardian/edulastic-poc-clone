import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty } from 'lodash'

import { withNamespaces } from '@edulastic/localization'
import { IconSearch } from '@edulastic/icons'
import { TokenStorage } from '@edulastic/api'
import { EduIf, notification } from '@edulastic/common'

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
import {
  ToolBarContainer,
  ButtonWithStyle,
} from '../common/ToolBar/styled-components'
import { MAX_MOBILE_WIDTH } from '../../constants/others'
import TimedTestTimer from '../common/TimedTestTimer'
import {
  currentItemAnswerChecksSelector,
  getCalcTypeSelector,
} from '../../selectors/test'
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import { StyledIconCheck } from '../../../author/ContentBuckets/components/ContentBucketsTable/styled'
import { CalculatorIconWrapper } from '../common/ToolBar/CalculatorIconWrapper'

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
  calcTypes,
  checkAnswer,
  checkAnswerInProgress,
  isPremiumContentWithoutAccess = false,
  t: i18Translate,
}) => {
  const isMobile = windowWidth <= MAX_MOBILE_WIDTH

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
                <ToolBarContainer>
                  <EduIf condition={!isEmpty(calcTypes)}>
                    <Tooltip
                      placement="top"
                      title={i18Translate('header:toolbar.calculator')}
                    >
                      <ButtonWithStyle
                        active={currentToolMode.calculator}
                        onClick={() => onChangeTool('calculator')}
                      >
                        <CalculatorIconWrapper
                          isMultiCalculators={calcTypes.length > 1}
                        />
                      </ButtonWithStyle>
                    </Tooltip>
                  </EduIf>
                  {showMagnifier && (
                    <Tooltip
                      placement="top"
                      title={i18Translate('header:toolbar.magnify')}
                    >
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
                          ? i18Translate(
                              'student:common.test.checkAnswerInfoTexts.inProgress'
                            )
                          : answerChecksUsedForItem >= settings.maxAnswerChecks
                          ? i18Translate(
                              'student:common.test.checkAnswerInfoTexts.usageLimitExceeded'
                            )
                          : i18Translate('student:common.test.checkanswer')
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
                </ToolBarContainer>
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
  calcTypes: getCalcTypeSelector(state),
  checkAnswerInProgress: state?.test?.checkAnswerInProgress,
})

const mapDispatchToProps = {
  checkAnswer: checkAnswerEvaluation,
}

const enhance = compose(
  withNamespaces(['header', 'student']),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(PlayerHeader)
