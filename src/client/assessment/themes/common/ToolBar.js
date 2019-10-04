import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Tooltip } from "antd";

import { test, questionType } from "@edulastic/constants";
import { IconCursor, IconInRuler, IconCalculator, IconClose, IconProtactor, IconScratchPad } from "@edulastic/icons";

const { calculatorTypes } = test;
class ToolBar extends Component {
  toolbarHandler = value => {
    const { changeTool } = this.props;
    changeTool(value);
  };

  handleCalculateMode = value => {
    const { changeTool } = this.props;
    changeTool(2);

    const { changeCaculateMode } = this.props;
    changeCaculateMode(value);
  };

  componentDidMount() {}

  render() {
    const { settings, tool, qType } = this.props;
    const { calcType } = settings;
    const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE;

    return (
      <Container>
        <Tooltip placement="top" title="Pointer">
          <StyledButton enable={tool.indexOf(0) !== -1} onClick={() => this.toolbarHandler(0)}>
            <CursorIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Ruler">
          <StyledButton enable={tool === 1} onClick={() => this.toolbarHandler(1)}>
            <InRulerIcon />
          </StyledButton>
        </Tooltip>
        {calcType !== calculatorTypes.NONE && (
          <Tooltip placement="top" title="Calculator">
            <StyledButton enable={tool.indexOf(2) !== -1} onClick={() => this.toolbarHandler(2)}>
              <CaculatorIcon />
            </StyledButton>
          </Tooltip>
        )}

        <Tooltip
          placement="top"
          title={isDisableCrossBtn ? "This option is available only for multiple choice" : "Crossout"}
        >
          <StyledButton
            enable={tool.indexOf(3) !== -1}
            disabled={isDisableCrossBtn}
            onClick={() => this.toolbarHandler(3)}
          >
            <CloseIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Protactor">
          <StyledButton enable={tool.indexOf(4) !== -1} onClick={() => this.toolbarHandler(4)}>
            <ProtactorIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Scratch Pad">
          <StyledButton enable={tool.indexOf(5) !== -1} onClick={() => this.toolbarHandler(5)}>
            <ScratchPadIcon />
          </StyledButton>
        </Tooltip>
      </Container>
    );
  }
}

ToolBar.propTypes = {
  changeCaculateMode: PropTypes.func.isRequired,
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
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
