import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Typography } from "antd";
import { IconCircleLogout, IconContrast, IconSend } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";
import { setSettingsModalVisibilityAction } from "../../../student/Sidebar/ducks";
import { extraDesktopWidthMax, mediumDesktopExactWidth, themeColor } from "@edulastic/colors";

const { Text } = Typography;

const SaveAndExit = ({ finishTest, previewPlayer, setSettingsModalVisibility, showZoomBtn, onSubmit }) => (
  <FlexContainer marginLeft="30px">
    {showZoomBtn && (
      <StyledButton title="Visual Assistance" onClick={() => setSettingsModalVisibility(true)}>
        <IconContrast />
      </StyledButton>
    )}
    {onSubmit && (
      <StyledButton onClick={onSubmit}>
        <IconSend />
      </StyledButton>
    )}
    <SaveAndExitButton title={previewPlayer ? "Exit" : "Save & Exit"} data-cy="finishTest" onClick={finishTest}>
      <StyledFlex>
        <SyledSpan>
          <IconCircleLogout />
        </SyledSpan>
        <StyledText>Save & Exit</StyledText>
      </StyledFlex>
    </SaveAndExitButton>
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
  margin-left: 2px;
  background: ${({ theme }) => theme.default.headerButtonBgColor};
  height: ${props => props.theme.default.headerToolbarButtonWidth};
  width: ${props => props.theme.default.headerToolbarButtonHeight};

  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    height: ${props => props.theme.default.headerRightButtonFontIconHeight};
    width: ${props => props.theme.default.headerRightButtonFontIconWidth};
    fill: ${({ theme }) => theme.default.headerRightButtonBgColor};
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
    background: ${({ theme }) => theme.default.headerRightButtonBgHoverColor};
    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
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

const SaveAndExitButton = styled(Button)`
  background: ${({ theme }) => theme.default.headerRightButtonBgColor};
  height: ${({ theme }) => theme.default.headerToolbarButtonWidth};
  margin-left: 2px;
  svg {
    height: ${({ theme }) => theme.default.headerRightButtonFontIconHeight};
    width: ${({ theme }) => theme.default.headerRightButtonFontIconWidth};
    fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
  }

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.default.headerRightButtonBgHoverColor};

    svg {
      fill: ${({ theme }) => theme.default.headerRightButtonIconColor};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-left: 5px;
    height: 45px;
  }
`;

const StyledFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const StyledText = styled(Text)`
  color: ${themeColor};
  font-size: 15px;
  padding-right: 15px;
`;

const SyledSpan = styled.span`
  line-height: 0;
  margin-top: 1px;
  padding-right: 15px;
`;
