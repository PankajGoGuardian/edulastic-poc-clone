import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";
import { IconCircleLogout, IconAccessibility, IconSend } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";
import { setSettingsModalVisibilityAction } from "../../../student/Sidebar/ducks";

const SaveAndExit = ({ finishTest, previewPlayer, setSettingsModalVisibility, showZoomBtn, onSubmit }) => (
  <FlexContainer marginLeft="30px">
    {showZoomBtn && (
      <StyledButton title="Visual Assistance" onClick={() => setSettingsModalVisibility(true)}>
        <IconAccessibility />
      </StyledButton>
    )}

    {previewPlayer ? (
      <SaveAndExitButton title="Exit" data-cy="finishTest" onClick={finishTest}>
        <IconCircleLogout />
        EXIT
      </SaveAndExitButton>
    ) : (
      <SaveAndExitButton title="Save & Exit" data-cy="finishTest" onClick={finishTest}>
        <IconCircleLogout />
        SAVE & EXIT
      </SaveAndExitButton>
    )}
    {onSubmit && (
      <StyledButton onClick={onSubmit}>
        <IconSend />
      </StyledButton>
    )}
  </FlexContainer>
);

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
  null,
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
