import {
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  smallDesktopWidth,
  themeColorBlue,
} from '@edulastic/colors'
import {
  EduButton,
  FireBaseService as Fbs,
  FlexContainer,
  isSEB,
} from '@edulastic/common'
import {
  IconAccessibility,
  IconCircleLogout,
  IconSend,
  IconPlusRounded,
  IconMinusRounded,
} from '@edulastic/icons'
import { Button, Tooltip } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  toggleScratchpadVisbilityAction,
  adjustScratchpadDimensionsAction,
} from '../../../common/components/Scratchpad/duck'
import { setSettingsModalVisibilityAction } from '../../../student/Sidebar/ducks'
import TimedTestTimer from './TimedTestTimer'

export function useUtaPauseAllowed(utaId) {
  if (!utaId) {
    return true
  }
  const firestoreCollectionName = 'timedAssignmentUTAs'
  const uta = Fbs.useFirestoreRealtimeDocument(
    (db) => db.collection(firestoreCollectionName).doc(utaId),
    [utaId]
  )
  const utaPauseAllowed = uta?.pauseAllowed || false
  return uta ? utaPauseAllowed : undefined
}
const inSEB = isSEB()

const SaveAndExit = ({
  finishTest,
  previewPlayer,
  setSettingsModalVisibility,
  showZoomBtn,
  onSubmit,
  pauseAllowed = true,
  utaId,
  groupId,
  timedAssignment,
  isCliUserPreview,
  isCliUser,
  LCBPreviewModal,
  hideData,
  toggleScratchpadVisibility,
  hidePause,
  savingResponse,
  adjustScratchpad,
  isPremiumContentWithoutAccess = false,
}) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? pauseAllowed : _pauseAllowed
  const currentVisibilityState = hideData ? 'show' : 'hide'
  return (
    <FlexContainer alignItems="center">
      {timedAssignment && <TimedTestTimer utaId={utaId} groupId={groupId} />}
      {LCBPreviewModal && (
        <>
          <AdjustScratchpad
            onClick={() => adjustScratchpad(5)}
            disabled={isPremiumContentWithoutAccess}
          >
            <IconPlusRounded />
          </AdjustScratchpad>
          <AdjustScratchpad
            onClick={() => adjustScratchpad(-5)}
            disabled={isPremiumContentWithoutAccess}
          >
            <IconMinusRounded />
          </AdjustScratchpad>
          <ScratchpadVisibilityToggler
            onClick={toggleScratchpadVisibility}
            disabled={isPremiumContentWithoutAccess}
          >
            {currentVisibilityState} student work
          </ScratchpadVisibilityToggler>
        </>
      )}
      {showZoomBtn && !LCBPreviewModal && (
        <Tooltip placement="bottom" title="Test Options">
          <StyledButton
            data-cy="testOptions"
            aria-label="test options button"
            onClick={() => setSettingsModalVisibility(true)}
          >
            <IconAccessibility />
          </StyledButton>
        </Tooltip>
      )}
      {showPause &&
        !inSEB &&
        (previewPlayer ? (
          <>
            {!isCliUserPreview && (
              <Tooltip
                placement="bottom"
                title={
                  hidePause
                    ? 'This assignment is configured to completed in a single sitting'
                    : 'Exit'
                }
              >
                <SaveAndExitButton
                  data-cy="finishTest"
                  aria-label="finish test button"
                  disabled={hidePause}
                  onClick={finishTest}
                >
                  <IconCircleLogout />
                  EXIT
                </SaveAndExitButton>
              </Tooltip>
            )}
          </>
        ) : (
          <>
            {!isCliUser && (
              <Tooltip
                placement="bottomRight"
                title={
                  hidePause
                    ? 'This assignment is configured to completed in a single sitting'
                    : 'Save & Exit'
                }
              >
                <SaveAndExitButton
                  disabled={hidePause}
                  data-cy="finishTest"
                  aria-label="finish test button"
                  onClick={finishTest}
                >
                  <IconCircleLogout />
                </SaveAndExitButton>
              </Tooltip>
            )}
          </>
        ))}
      {onSubmit && (
        <StyledDiv id="submitTestButton" tabIndex="-1">
          <EduButton
            height="100%"
            isGhost
            onClick={onSubmit}
            loading={savingResponse}
          >
            <IconSend />
            SUBMIT
          </EduButton>
        </StyledDiv>
      )}
    </FlexContainer>
  )
}

SaveAndExit.propTypes = {
  finishTest: PropTypes.func.isRequired,
  adjustScratchpad: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  setSettingsModalVisibility: PropTypes.func,
  previewPlayer: PropTypes.bool,
  showZoomBtn: PropTypes.bool,
  savingResponse: PropTypes.bool,
}

SaveAndExit.defaultProps = {
  showZoomBtn: false,
  previewPlayer: false,
  setSettingsModalVisibility: () => null,
  onSubmit: null,
  savingResponse: false,
}

export default connect(
  (state) => ({
    pauseAllowed: state.test?.settings?.pauseAllowed,
    isCliUser: get(state, 'user.isCliUser', false),
    hideData: state?.scratchpad?.hideData,
    savingResponse: get(state, 'test.savingResponse', false),
  }),
  {
    adjustScratchpad: adjustScratchpadDimensionsAction,
    setSettingsModalVisibility: setSettingsModalVisibilityAction,
    toggleScratchpadVisibility: toggleScratchpadVisbilityAction,
  }
)(SaveAndExit)

const StyledButton = styled(Button)`
  border: none;
  margin-left: 5px;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  height: ${(props) => props.theme.default.headerToolbarButtonWidth};
  width: ${(props) => props.theme.default.headerToolbarButtonHeight};
  border: ${({ theme }) =>
    `1px solid ${theme.default.headerRightButtonBgColor}`};

  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    height: ${(props) => props.theme.default.headerRightButtonFontIconHeight};
    width: ${(props) => props.theme.default.headerRightButtonFontIconWidth};
    fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }

  &:first-child {
    margin-left: 0px;
  }

  &:focus {
    background: ${({ theme }) => theme.default.headerButtonBgColor};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }

  &:hover,
  &:active {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
    border: ${({ theme }) =>
      `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
    width: 40px;
  }
`

export const SaveAndExitButton = styled(StyledButton)`
  width: auto;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  border: ${({ theme }) =>
    `1px solid ${theme.default.headerRightButtonBgColor}`};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  font-size: 12px;
  font-weight: 600;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  svg {
    position: relative;
    transform: none;
    top: unset;
    left: unset;
    fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
    border: ${({ theme }) =>
      `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  &:focus {
    border: none;
    outline: 0;
    box-shadow: 0 0 0 2px ${themeColorBlue};
  }

  span {
    margin-left: 8px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: auto;
    &.ant-btn {
      height: ${(props) => props.height};
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-left: 5px;
    width: auto;
    &.ant-btn {
      height: ${(props) => props.height};
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    height: ${(props) => props.height};
  }
`

const ScratchpadVisibilityToggler = styled(SaveAndExitButton)`
  width: auto !important;
  text-transform: uppercase;
`

const AdjustScratchpad = styled(SaveAndExitButton)`
  padding: 0px 12px;
`
const StyledDiv = styled.div`
  height: 40px;
`
