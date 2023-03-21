import {
  EduButton,
  EduIf,
  EduThen,
  FireBaseService as Fbs,
  FlexContainer,
  isSEB,
} from '@edulastic/common'
import ImmersiveReader from '@edulastic/common/src/components/ImmersiveReader/ImmersiveReader'
import {
  IconAccessibility,
  IconCircleLogout,
  IconSend,
  IconPlusRounded,
  IconMinusRounded,
} from '@edulastic/icons'
import { Tooltip } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { getUserFeatures } from '../../../author/src/selectors/user'
import {
  toggleScratchpadVisbilityAction,
  adjustScratchpadDimensionsAction,
} from '../../../common/components/Scratchpad/duck'
import { setSettingsModalVisibilityAction } from '../../../student/Sidebar/ducks'
import {
  AdjustScratchpad,
  SaveAndExitButton,
  ScratchpadVisibilityToggler,
  StyledButton,
  StyledDiv,
} from './styledCompoenents'

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
  showImmersiveReader,
  currentItem,
  options,
  features,
}) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId)
  const showPause = _pauseAllowed === undefined ? pauseAllowed : _pauseAllowed
  const currentVisibilityState = hideData ? 'show' : 'hide'
  const immersiveReaderTitle = `Question ${currentItem + 1}/${get(
    options,
    'length',
    ''
  )}`
  const { canUseImmersiveReader = false } = features

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
      <EduIf condition={!!showImmersiveReader && canUseImmersiveReader}>
        <EduThen>
          <ImmersiveReader title={immersiveReaderTitle} />
        </EduThen>
      </EduIf>
      {showZoomBtn && !LCBPreviewModal && (
        <Tooltip placement="bottom" title="Test Options">
          <StyledButton
            data-cy="testOptions"
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
  options: PropTypes.array.isRequired,
  currentItem: PropTypes.number.isRequired,
  features: PropTypes.object,
}

SaveAndExit.defaultProps = {
  showZoomBtn: false,
  previewPlayer: false,
  setSettingsModalVisibility: () => null,
  onSubmit: null,
  savingResponse: false,
  features: {},
}

export default connect(
  (state) => ({
    pauseAllowed: state.test?.settings?.pauseAllowed,
    isCliUser: get(state, 'user.isCliUser', false),
    hideData: state?.scratchpad?.hideData,
    savingResponse: get(state, 'test.savingResponse', false),
    showImmersiveReader: get(state, 'test.settings.showImmersiveReader', false),
    features: getUserFeatures(state),
  }),
  {
    adjustScratchpad: adjustScratchpadDimensionsAction,
    setSettingsModalVisibility: setSettingsModalVisibilityAction,
    toggleScratchpadVisibility: toggleScratchpadVisbilityAction,
  }
)(SaveAndExit)
