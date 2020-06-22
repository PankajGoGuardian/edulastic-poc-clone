import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";
import { FireBaseService as Fbs, FlexContainer,EduButton } from "@edulastic/common";
import { IconAccessibility, IconCircleLogout, IconSend } from "@edulastic/icons";
import { Button } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { setSettingsModalVisibilityAction } from "../../../student/Sidebar/ducks";
import TimedTestTimer from "./TimedTestTimer";

export function useUtaPauseAllowed(utaId) {
  utaId = utaId || "undefined";
  const firestoreCollectionName = "timedAssignmentUTAs";
  const uta = Fbs.useFirestoreRealtimeDocument(db => db.collection(firestoreCollectionName).doc(utaId), [utaId]);
  const utaPauseAllowed = uta?.pauseAllowed || false;
  return uta ? utaPauseAllowed : undefined;
}

const SaveAndExit = ({
  finishTest,
  previewPlayer,
  setSettingsModalVisibility,
  showZoomBtn,
  onSubmit,
  pauseAllowed = true,
  utaId,
  groupId,
  timedAssignment
}) => {
  const _pauseAllowed = useUtaPauseAllowed(utaId);
  const showPause = _pauseAllowed === undefined ? pauseAllowed : _pauseAllowed;
  return (
    <FlexContainer marginLeft="30px">
      {timedAssignment && <TimedTestTimer utaId={utaId} groupId={groupId} />}
      {showZoomBtn && (
        <StyledButton title="Visual Assistance" onClick={() => setSettingsModalVisibility(true)}>
          <IconAccessibility />
        </StyledButton>
      )}

      {showPause &&
        (previewPlayer ? (
          <SaveAndExitButton title="Exit" data-cy="finishTest" onClick={finishTest}>
            <IconCircleLogout />
            EXIT
          </SaveAndExitButton>
        ) : (
          <SaveAndExitButton title="Save & Exit" data-cy="finishTest" onClick={finishTest}>
            <IconCircleLogout />
          </SaveAndExitButton>
        ))}
      {onSubmit && (
        <EduButton isGhost onClick={onSubmit}>
          <IconSend />
          SUBMIT
        </EduButton>
      )}
    </FlexContainer>
  );
};

SaveAndExit.propTypes = {
  finishTest: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  setSettingsModalVisibility: PropTypes.func,
  previewPlayer: PropTypes.bool,
  showZoomBtn: PropTypes.bool
};

SaveAndExit.defaultProps = {
  showZoomBtn: false,
  previewPlayer: false,
  setSettingsModalVisibility: () => null,
  onSubmit: null
};

export default connect(
  state => ({
    pauseAllowed: state.test?.settings?.pauseAllowed
  }),
  {
    setSettingsModalVisibility: setSettingsModalVisibilityAction
  }
)(SaveAndExit);

const StyledButton = styled(Button)`
  border: none;
  margin-left: 5px;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  color: ${({ theme }) => theme.default.headerRightButtonIconColor};
  height: ${props => props.theme.default.headerToolbarButtonWidth};
  width: ${props => props.theme.default.headerToolbarButtonHeight};
  border: ${({ theme }) => `1px solid ${theme.default.headerRightButtonBgColor}`};

  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    height: ${props => props.theme.default.headerRightButtonFontIconHeight};
    width: ${props => props.theme.default.headerRightButtonFontIconWidth};
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
  }

  &:hover,
  &:active {
    background: ${({ theme }) => theme.default.headerRightButtonIconColor};
    color: ${({ theme }) => theme.default.headerRightButtonBgColor};
    border: ${({ theme }) => `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
    width: 40px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-left: 5px;
    height: 45px;
    width: 45px;
  }
`;

export const SaveAndExitButton = styled(StyledButton)`
  width: auto;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  border: ${({ theme }) => `1px solid ${theme.default.headerRightButtonBgColor}`};
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
    border: ${({ theme }) => `solid 1px ${theme.default.headerRightButtonBgColor}`};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
    }
  }

  span {
    margin-left: 8px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: auto;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-left: 5px;
    width: auto;
  }
`;
