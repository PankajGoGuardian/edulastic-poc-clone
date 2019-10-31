import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";
import { IconCircleLogout, IconContrast } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";

const SaveAndExit = ({ finishTest, previewPlayer, openSettings }) => (
  <FlexContainer>
    <StyledButton onClick={openSettings}>
      <IconContrast />
    </StyledButton>
    <StyledButton title={previewPlayer ? "Exit" : "Save & Exit"} data-cy="finishTest" onClick={finishTest}>
      <IconCircleLogout />
    </StyledButton>
  </FlexContainer>
);

SaveAndExit.propTypes = {
  finishTest: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired,
  previewPlayer: PropTypes.bool
};

SaveAndExit.defaultProps = {
  previewPlayer: false
};

export default SaveAndExit;

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
