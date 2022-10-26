import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { withWindowSizes } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  test as testConstants,
  testTypes as testTypesConstants,
  questionType,
} from '@edulastic/constants'
import {
  IconEduLogo,
  IconDrc,
  IconCalculator,
  IconScratchPad,
  IconCloudUpload,
} from '@edulastic/icons'
import { TokenStorage } from '@edulastic/api'
import { Select } from 'antd'
import {
  lightGreySecondary,
  themeColorBlue,
  title as titleColor,
} from '@edulastic/colors'
import {
  Header,
  FlexContainer,
  HeaderWrapper,
  HeaderMainMenu,
} from '../../common'

import { StyledHeaderTitle, Container } from './styled'
import { themes } from '../../../../theme'
import {
  setSettingsModalVisibilityAction,
  setZoomLevelAction,
} from '../../../../student/Sidebar/ducks'
import SettingsModal from '../../../../student/sharedComponents/SettingsModal'
import TimedTestTimer from '../../common/TimedTestTimer'
import QuestionSelectDropdown from '../../common/QuestionSelectDropdown'

const {
  playerSkin: { drc },
} = themes
const { header1, header2 } = drc

const CALC = 2
const CROSS_BUTTON = 3
const SCRATCHPAD = 5

const PlayerHeader = ({
  t,
  title,
  currentItem,
  gotoQuestion,
  headerRef,
  moveToNext,
  options,
  skipped = [],
  bookmarks = [],
  blockNavigationToAnsweredQuestions = false,
  testType,
  timedAssignment,
  utaId,
  groupId,
  zoomLevel,
  settings,
  answerChecksUsedForItem,
  checkAnswerInProgress,
  checkAnswer,
  changeTool,
  qType,
  hasDrawingResponse,
  toggleUserWorkUploadModal,
  enableMagnifier,
  handleMagnifier,
  tool,
  isPremiumContentWithoutAccess = false,
  canShowPlaybackOptionTTS,
}) => {
  const {
    calcType,
    enableScratchpad,
    isTeacherPremium,
    showMagnifier,
    maxAnswerChecks,
  } = settings

  const { PRACTICE } = testTypesConstants.TEST_TYPES
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE

  const hideCheckAnswer = !TokenStorage.getAccessToken()

  const handleCheckAnswer = () => {
    if (
      isPremiumContentWithoutAccess ||
      checkAnswerInProgress ||
      typeof checkAnswer !== 'function'
    ) {
      return null
    }
    checkAnswer()
  }

  return (
    <FlexContainer>
      {PRACTICE.includes(testType) && (
        <SettingsModal
          isPremiumContentWithoutAccess={isPremiumContentWithoutAccess}
          canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
        />
      )}
      <Header
        ref={headerRef}
        style={{
          background: header1.background,
          flexDirection: 'column',
          padding: '0',
          zIndex: 505,
        }}
      >
        <IconEduLogoStyled circleFill={header1.background} />
        <StyledHeaderTitle>
          <div style={{ display: 'flex' }}>
            <Title data-cy="title" title={title}>
              {title}
            </Title>
          </div>
        </StyledHeaderTitle>
        <HeaderMainMenu style={{ background: header2.background }}>
          <NavigationHeader>
            <HeaderWrapper justifyContent="space-between">
              <Container>
                <QuestionSelectDropdown
                  key={currentItem}
                  currentItem={currentItem}
                  gotoQuestion={gotoQuestion}
                  options={options}
                  bookmarks={bookmarks}
                  skipped={skipped}
                  dropdownStyle={{ marginRight: '15px', height: '32px' }}
                  zoomLevel={zoomLevel}
                  moveToNext={moveToNext}
                  utaId={utaId}
                  blockNavigationToAnsweredQuestions={
                    blockNavigationToAnsweredQuestions
                  }
                />
                {maxAnswerChecks > 0 && !hideCheckAnswer && (
                  <ButtonWrapper
                    hoverEffect
                    onClick={handleCheckAnswer}
                    title={
                      checkAnswerInProgress
                        ? 'In progress'
                        : answerChecksUsedForItem >= maxAnswerChecks
                        ? 'Usage limit exceeded'
                        : 'Check Answer'
                    }
                    data-cy="checkAnswer"
                    aria-label="Check answer"
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <IconDrc.Cursor
                      color={header2.background}
                      aria-hidden="true"
                    />
                  </ButtonWrapper>
                )}
                <ButtonWrapper
                  active={tool?.includes(CROSS_BUTTON)}
                  onClick={() =>
                    isDisableCrossBtn ? null : changeTool(CROSS_BUTTON)
                  }
                  disabled={isDisableCrossBtn || isPremiumContentWithoutAccess}
                  title={
                    isDisableCrossBtn
                      ? 'This option is available only for multiple choice'
                      : 'Crossout'
                  }
                  data-cy="crossButton"
                  aria-label="Crossout"
                >
                  <IconDrc.AnswerEliminator
                    color={header2.background}
                    aria-hidden="true"
                  />
                </ButtonWrapper>
                {calcType !== testConstants.calculatorTypes.NONE && (
                  <ButtonWrapper
                    active={tool?.includes(CALC)}
                    onClick={() => changeTool(CALC)}
                    title={t('common.test.calculator')}
                    disabled={isPremiumContentWithoutAccess}
                    aria-label="Calculator"
                  >
                    <IconCalculator
                      color={header2.background}
                      aria-hidden="true"
                    />
                  </ButtonWrapper>
                )}
                {enableScratchpad && !hasDrawingResponse && (
                  <ButtonWrapper
                    active={tool?.includes(SCRATCHPAD)}
                    onClick={() => changeTool(SCRATCHPAD)}
                    title={t('common.test.scratchPad')}
                    data-cy="scratchPad"
                    disabled={isPremiumContentWithoutAccess}
                    aria-label="Scratch Pad"
                  >
                    <IconScratchPad
                      color={header2.background}
                      aria-hidden="true"
                    />
                  </ButtonWrapper>
                )}
                {showMagnifier && (
                  <ButtonWrapper
                    active={enableMagnifier}
                    onClick={handleMagnifier}
                    title={t('common.test.magnify')}
                    data-cy="magnify"
                    disabled={isPremiumContentWithoutAccess}
                    aria-label="Magnify"
                  >
                    <IconDrc.Zoom
                      color={header2.background}
                      aria-hidden="true"
                    />
                  </ButtonWrapper>
                )}

                {isTeacherPremium && (
                  <ButtonWrapper
                    onClick={toggleUserWorkUploadModal}
                    title={t('common.test.uploadWork')}
                    data-cy="uploadWork"
                    aria-label="Upload Work"
                    disabled={isPremiumContentWithoutAccess}
                  >
                    <IconCloudUpload
                      color={header2.background}
                      aria-hidden="true"
                    />
                  </ButtonWrapper>
                )}
              </Container>
              <RightContent>
                {timedAssignment && (
                  <TimedTestTimer
                    utaId={utaId}
                    groupId={groupId}
                    style={{
                      marginRight: '0px',
                      padding: '0',
                      minHeight: 'auto',
                      fontSize: '12px',
                    }}
                  />
                )}
              </RightContent>
            </HeaderWrapper>
          </NavigationHeader>
        </HeaderMainMenu>
      </Header>
    </FlexContainer>
  )
}

PlayerHeader.defaultProps = {
  onSaveProgress: () => {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('student'),
  connect(
    (state) => ({
      settings: state.test.settings,
      timedAssignment: state.test?.settings?.timedAssignment,
      testType: state.test?.settings?.testType,
      grades: state.test?.grades,
      subjects: state.test?.subjects,
      zoomLevel: state.ui.zoomLevel,
    }),
    {
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
      setZoomLevel: setZoomLevelAction,
    }
  )
)

export default enhance(PlayerHeader)

const NavigationHeader = styled(FlexContainer)`
  padding: 7px 50px;
  justify-content: space-between;
  .question-select-dropdown .ant-select {
    height: 32px;
  }
  .question-select-dropdown .anticon-down svg {
    fill: ${header2.background};
  }
  .ant-select-selection .ant-select-selection__rendered i {
    margin-top: 8px;
    margin-right: 5px;
    font-size: 14px;
  }
  .ant-select-selection .ant-select-selection__rendered svg {
    width: 10px;
    min-width: 10px;
    margin-right: 5px;
  }
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
`
const CommonTagStyle = css`
  text-transform: capitalize;
  font-size: 14px;
  border-radius: 2px;
  color: ${header2.textColor};
  margin-right: 5px;
  font-weight: bold;
`

const Title = styled.div`
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${CommonTagStyle}
`

const IconEduLogoStyled = styled(IconEduLogo)`
  position: absolute;
  width: 30px;
  top: -5px;
  left: 8px;
`

const ButtonWrapper = styled.span.attrs({
  role: 'button',
})`
  width: 32px;
  height: 32px;
  background: ${header2.textColor};
  margin-left: 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    props.active &&
    `
    background: ${header2.background};
    color: ${header2.textColor};
    border: 1px solid ${header2.textColor};
    svg{
      fill: ${header2.textColor};
      color: ${header2.textColor};
    }
  `}
  ${(props) =>
    !props.disabled
      ? `
  :hover {
    background: ${header2.background};
    color: ${header2.textColor};
    border: 1px solid ${header2.textColor};
    svg{
      fill: ${header2.textColor};
      color: ${header2.textColor};
    }
  }`
      : `
    opacity: 0.5; 
    cursor: default;
  `}
`

export const StyledSelect = styled(Select)`
  margin-left: 20px;
  width: 100px;
  font-size: ${(props) => props.theme.smallFontSize};
  .ant-select-selection {
    height: 32px;
    border: 1px solid ${(props) => props.theme.header.settingsInputBorder};
    background: ${lightGreySecondary};
    color: ${titleColor};
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
  }
  .ant-select-selection__rendered {
    margin: 2px 15px;
  }
`
