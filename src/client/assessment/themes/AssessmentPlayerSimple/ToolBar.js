/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Tooltip } from "antd";

import { test, questionType } from "@edulastic/constants";
import { IconCursor, IconInRuler, IconCalculator, IconClose, IconProtactor, IconScratchPad } from "@edulastic/icons";

const { calculatorTypes } = test;

// TODO toolbar functionality has to be updated for default assessment player by using this.

const ToolBar = ({ settings, tools, qType, toggleToolsOpenStatus }) => {
  const { calcType } = settings;
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE;
  return (
    <Container>
      <Tooltip placement="top" title="Pointer">
        <StyledButton enable={tools.Pointer} onClick={() => toggleToolsOpenStatus("Pointer")}>
          <CursorIcon />
        </StyledButton>
      </Tooltip>

      <Tooltip placement="top" title="Ruler">
        <StyledButton enable={tools.Pointer} onClick={() => toggleToolsOpenStatus("Ruler")}>
          <InRulerIcon />
        </StyledButton>
      </Tooltip>
      {calcType !== calculatorTypes.NONE && (
        <Tooltip placement="top" title="Calculator">
          <StyledButton enable={tools.Calculator} onClick={() => toggleToolsOpenStatus("Calculator")}>
            <CaculatorIcon />
          </StyledButton>
        </Tooltip>
      )}

      <Tooltip
        placement="top"
        title={isDisableCrossBtn ? "This option is available only for multiple choice" : "Crossout"}
      >
        <StyledButton
          disabled={isDisableCrossBtn}
          enable={tools.CrossButton}
          onClick={() => toggleToolsOpenStatus("CrossButton")}
        >
          <CloseIcon />
        </StyledButton>
      </Tooltip>

      <Tooltip placement="top" title="Protactor">
        <StyledButton enable={tools.Protactor} onClick={() => toggleToolsOpenStatus("Protactor")}>
          <ProtactorIcon />
        </StyledButton>
      </Tooltip>

      <Tooltip placement="top" title="Scratch Pad">
        <StyledButton enable={tools.ScratchPad} onClick={() => toggleToolsOpenStatus("ScratchPad")}>
          <ScratchPadIcon />
        </StyledButton>
      </Tooltip>
    </Container>
  );
};

ToolBar.propTypes = {
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired
};

export default ToolBar;

const Container = styled.div`
  margin-left: 60px;
`;

const customizeIcon = icon => styled(icon)`
  fill: ${props => props.theme.header.headerButtonColor};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${props => props.theme.header.headerButtonColor};
  }
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: ${props => (props.enable ? props.theme.default.headerButtonActiveBgColor : "transparent")};
  border-color: ${props => props.theme.default.headerButtonBorderColor};
  height: ${props => props.theme.default.headerToolbarButtonWidth};
  width: ${props => props.theme.default.headerToolbarButtonHeight};

  svg {
    height: ${props => props.theme.default.headerButtonFontIconWidth};
    width: ${props => props.theme.default.headerButtonFontIconHeight};
  }

  &:focus,
  &:hover,
  &:active {
    background: ${props => (props.enable ? props.theme.default.headerButtonActiveBgColor : "transparent")};
    border-color: ${props => props.theme.default.headerButtonActiveBgColor};
  }
  :disabled {
    opacity: 0.4;
    background: transparent;
  }
`;

const CursorIcon = customizeIcon(IconCursor);

const InRulerIcon = customizeIcon(IconInRuler);

const CaculatorIcon = customizeIcon(IconCalculator);

const CloseIcon = customizeIcon(IconClose);

const ProtactorIcon = customizeIcon(IconProtactor);

const ScratchPadIcon = customizeIcon(IconScratchPad);
