import {
  EduButton,
  EduIf,
  EduThen,
  FireBaseService as Fbs,
  FlexContainer,
  isSEB,
  ImmersiveReader,
} from '@edulastic/common'
import {
  IconAccessibility,
  IconCircleLogout,
  IconSend,
  IconPlusRounded,
  IconMinusRounded,
  IconImmersiveReader,
  IconProfileCircle,
  IconUserRegular,
} from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Dropdown, Icon, Menu, Tooltip } from 'antd'
import { get, isNaN } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { themeColor } from '@edulastic/colors'
import { getUserNameSelector } from '../../../author/src/selectors/user'
import {
  toggleScratchpadVisbilityAction,
  adjustScratchpadDimensionsAction,
} from '../../../common/components/Scratchpad/duck'
import { setSettingsModalVisibilityAction } from '../../../student/Sidebar/ducks'
import {
  AdjustScratchpad,
  StyledMenuItem,
  SaveAndExitButton,
  ScratchpadVisibilityToggler,
  StyledButton,
  StyledDiv,
  StyledDefaultMenuItem,
  StyledTextForStudent,
  StyledTextForDropdown,
} from './styledCompoenents'

import TimedTestTimer from './TimedTestTimer'
import { getUserAccommodations } from '../../../student/Login/ducks'
import { isImmersiveReaderEnabled } from '../../utils/helpers'

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

const ImmersiveReaderButton = (props) => {
  return (
    <StyledButton {...props}>
      <IconImmersiveReader />
    </StyledButton>
  )
}

const SaveAndExit = ({
  finishTest,
  previewPlayer,
  setSettingsModalVisibility,
  showZoomBtn,
  onSubmit,
  pauseAllowed: defaultPauseAllowed = true,
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
  showImmersiveReader,
  currentItem,
  options,
  userName,
  t: i18Translate,
  accommodations,
}) => {
  const utaPauseAllowed = useUtaPauseAllowed(utaId)

  const showPause =
    utaPauseAllowed === undefined ? defaultPauseAllowed : utaPauseAllowed

  const currentVisibilityState = hideData ? 'show' : 'hide'

  const currentItemIndex = Number(currentItem + 1)
  const totalNumberOfItems = get(options, 'length', 0)

  let immersiveReaderTitle = ''

  if (!isNaN(currentItemIndex) && totalNumberOfItems) {
    immersiveReaderTitle = `Question ${currentItemIndex}/${totalNumberOfItems}`
  }

  const isIOS = window.isIOS

  const isTestTakenByCliUser = isCliUserPreview && isCliUser
  const showExitButton = showPause && !inSEB && !isTestTakenByCliUser

  const menu = (
    <Menu>
      {showZoomBtn && !LCBPreviewModal && (
        <Menu.Item>
          <Tooltip placement="left" title={i18Translate('testOptions.title')}>
            <StyledMenuItem
              data-cy="testOptions"
              aria-label="Test options"
              onClick={() => setSettingsModalVisibility(true)}
            >
              <IconAccessibility
                height="22px"
                width="22px"
                style={{ fill: themeColor }}
              />{' '}
              Accessibility
            </StyledMenuItem>
          </Tooltip>
        </Menu.Item>
      )}
      {showExitButton && (
        <Menu.Item>
          <Tooltip
            placement="left"
            title={
              hidePause
                ? i18Translate('saveAndExit.assignmentInOneSitting')
                : i18Translate(
                    `saveAndExit.${previewPlayer ? 'exit' : 'saveAndExit'}`
                  )
            }
          >
            <StyledMenuItem
              data-cy="finishTest"
              aria-label="Save and exit"
              disabled={hidePause}
              onClick={finishTest}
            >
              <IconCircleLogout
                height="22px"
                width="22px"
                style={{ fill: themeColor }}
              />{' '}
              Exit
            </StyledMenuItem>
          </Tooltip>
        </Menu.Item>
      )}
    </Menu>
  )

  return (
    <FlexContainer alignItems="center">
      {!isIOS && (
        <FlexContainer alignItems="center">
          <IconProfileCircle isBgDark style={{ marginRight: '8px' }} />
          <Tooltip title={userName}>
            <StyledTextForStudent
              color="white"
              $timedAssignment={timedAssignment}
            >
              {userName}
            </StyledTextForStudent>
          </Tooltip>
        </FlexContainer>
      )}
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
      <EduIf
        condition={isImmersiveReaderEnabled(
          showImmersiveReader,
          accommodations
        )}
      >
        <EduThen>
          <ImmersiveReader
            ImmersiveReaderButton={ImmersiveReaderButton}
            title={immersiveReaderTitle}
          />
        </EduThen>
      </EduIf>
      {showZoomBtn && !LCBPreviewModal && !isIOS && (
        <Tooltip placement="bottom" title={i18Translate('testOptions.title')}>
          <StyledButton
            data-cy="testOptions"
            aria-label="Test options"
            onClick={() => setSettingsModalVisibility(true)}
          >
            <IconAccessibility />
          </StyledButton>
        </Tooltip>
      )}
      {isIOS ? (
        <Dropdown overlay={menu}>
          <StyledDefaultMenuItem>
            <FlexContainer alignItems="center">
              <IconUserRegular
                height="16px"
                width="16px"
                style={{ marginRight: '8px' }}
                fill={themeColor}
              />
              <StyledTextForDropdown
                $smallDesktopWidth="110px"
                $desktopWidth="110px"
              >
                {userName}
              </StyledTextForDropdown>
            </FlexContainer>{' '}
            <Icon type="down" />
          </StyledDefaultMenuItem>
        </Dropdown>
      ) : (
        showPause &&
        !inSEB &&
        (previewPlayer ? (
          <>
            {!isCliUserPreview && (
              <Tooltip
                placement="bottom"
                title={
                  hidePause
                    ? i18Translate('saveAndExit.assignmentInOneSitting')
                    : i18Translate('saveAndExit.exit')
                }
              >
                <SaveAndExitButton
                  data-cy="finishTest"
                  aria-label="Save and exit"
                  disabled={hidePause}
                  onClick={finishTest}
                >
                  <IconCircleLogout />
                  {i18Translate('saveAndExit.exit')}
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
                    ? i18Translate('saveAndExit.assignmentInOneSitting')
                    : i18Translate('saveAndExit.saveAndExit')
                }
              >
                <SaveAndExitButton
                  disabled={hidePause}
                  data-cy="finishTest"
                  aria-label="Save and exit"
                  onClick={finishTest}
                >
                  <IconCircleLogout />
                </SaveAndExitButton>
              </Tooltip>
            )}
          </>
        ))
      )}
      {onSubmit && (
        <StyledDiv id="submitTestButton" tabIndex="-1">
          <EduButton
            height="100%"
            isGhost
            onClick={onSubmit}
            loading={savingResponse}
          >
            <IconSend />
            {i18Translate('saveAndExit.submit')}
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
  options: PropTypes.array.isRequired,
  currentItem: PropTypes.number.isRequired,
}

SaveAndExit.defaultProps = {
  showZoomBtn: false,
  previewPlayer: false,
  setSettingsModalVisibility: () => null,
  onSubmit: null,
  savingResponse: false,
}

export default compose(
  withNamespaces('header'),
  connect(
    (state) => ({
      pauseAllowed: state.test?.settings?.pauseAllowed,
      isCliUser: get(state, 'user.isCliUser', false),
      hideData: state?.scratchpad?.hideData,
      savingResponse: get(state, 'test.savingResponse', false),
      showImmersiveReader: get(state, 'test.settings.showImmersiveReader'),
      userName: getUserNameSelector(state),
      accommodations: getUserAccommodations(state),
    }),
    {
      adjustScratchpad: adjustScratchpadDimensionsAction,
      setSettingsModalVisibility: setSettingsModalVisibilityAction,
      toggleScratchpadVisibility: toggleScratchpadVisbilityAction,
    }
  )
)(SaveAndExit)
