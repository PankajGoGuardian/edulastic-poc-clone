import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";
import { IconCircleLogout, IconContrast, IconSend } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { setSettingsModalVisibilityAction } from "../../../student/Sidebar/ducks";

const SaveAndExit = ({ finishTest, previewPlayer, setSettingsModalVisibility, showZoomBtn, onSubmit }) => (
  <FlexContainer>
    {showZoomBtn && (
      <StyledButton onClick={() => setSettingsModalVisibility(true)}>
        <IconContrast />
      </StyledButton>
    )}
    {onSubmit && (
      <StyledButton onClick={onSubmit}>
        <IconSend />
      </StyledButton>
    )}
    <StyledButton title={previewPlayer ? "Exit" : "Save & Exit"} data-cy="finishTest" onClick={finishTest}>
      <IconCircleLogout />
    </StyledButton>
  </FlexContainer>
);

SaveAndExit.propTypes = {
  finishTest: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  openSettings: PropTypes.func,
  previewPlayer: PropTypes.bool,
  showZoomBtn: PropTypes.bool
};

SaveAndExit.defaultProps = {
  showZoomBtn: false,
  previewPlayer: false,
  openSettings: () => null,
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
  margin-left: 10px;
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  height: ${props => props.theme.default.headerToolbarButtonWidth};
  width: ${props => props.theme.default.headerToolbarButtonHeight};

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

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.default.headerRightButtonBgHoverColor};

    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
    }
  }
`;
