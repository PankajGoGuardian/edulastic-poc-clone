import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";
import { white } from "@edulastic/colors";
import { IconSave, IconPause, IconLogout } from "@edulastic/icons";

const SaveAndExit = ({ finishTest, previewPlayer }) => (
  <Container>
    <StyledButton title={previewPlayer ? "Exit" : "Save & Exit"} data-cy="finishTest" onClick={finishTest}>
      <LogoutIcon />
    </StyledButton>
  </Container>
);

SaveAndExit.propTypes = {
  finishTest: PropTypes.func.isRequired
};

export default SaveAndExit;

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-top: 2px;
`;

const SaveIcon = styled(IconSave)`
  fill: ${white};
  width: 24px;
  height: 24px;
  &:hover {
    fill: #23e7ab;
  }
`;

const PauseIcon = styled(IconPause)`
  fill: ${white};
  width: 24px;
  height: 24px;
  &:hover {
    fill: #23e7ab;
  }
`;

const LogoutIcon = styled(IconLogout)`
  fill: ${props => props.theme.header.headerButtonColor};
  width: 24px;
  height: 24px;
  &:hover {
    fill: ${props => props.theme.header.headerButtonColor};
  }
`;

const StyledButton = styled(Button)`
  width: 45px;
  background: transparent;
  border: none;
  &:hover,
  &:focus {
    background: transparent;
  }

  height: ${props => props.theme.default.headerToolbarButtonWidth};
  width: ${props => props.theme.default.headerToolbarButtonHeight};

  svg {
    height: ${props => props.theme.default.headerExitButtonFontIconWidth};
    width: ${props => props.theme.default.headerExitButtonFontIconHeight};
  }
`;
