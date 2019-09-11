import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Tooltip } from "antd";

import { test, questionType } from "@edulastic/constants";
import { white } from "@edulastic/colors";
import { IconCursor, IconInRuler, IconCalculator, IconClose, IconProtactor, IconScratchPad } from "@edulastic/icons";
import CalculatorMenu from "./CalculatorMenu";

const { calculatorTypes } = test;
class ToolBar extends Component {
  toolbarHandler = value => {
    const { changeMode, changeTool } = this.props;

    changeTool(value);
    if (value === 5) {
      changeMode(value);
    } else {
      changeMode(value);
    }
  };

  handleCalculateMode = value => {
    const { changeTool } = this.props;
    changeTool(2);

    const { changeCaculateMode } = this.props;
    changeCaculateMode(value);
  };

  componentDidMount() {}

  render() {
    const { settings, calcBrands, tool, qType } = this.props;
    const { calcType } = settings;
    const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE;

    return (
      <Container>
        <Tooltip placement="top" title="Pointer">
          <StyledButton enable={tool === 0} onClick={() => this.toolbarHandler(0)}>
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
            <StyledButton enable={tool === 2} onClick={() => this.toolbarHandler(2)}>
              <CaculatorIcon />
              {tool === 2 && (
                <CalculatorMenu
                  changeCaculateMode={this.handleCalculateMode}
                  calcType={calcType}
                  calculatorTypes={calculatorTypes}
                  calcBrands={calcBrands}
                />
              )}
            </StyledButton>
          </Tooltip>
        )}

        <Tooltip
          placement="top"
          title={isDisableCrossBtn ? "This option is available only for multiple choice" : "Crossout"}
        >
          <StyledButton enable={tool === 3} disabled={isDisableCrossBtn} onClick={() => this.toolbarHandler(3)}>
            <CloseIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Protactor">
          <StyledButton enable={tool === 4} onClick={() => this.toolbarHandler(4)}>
            <ProtactorIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Scratch Pad">
          <StyledButton enable={tool === 5} onClick={() => this.toolbarHandler(5)}>
            <ScratchPadIcon />
          </StyledButton>
        </Tooltip>
      </Container>
    );
  }
}

ToolBar.propTypes = {
  changeMode: PropTypes.func.isRequired,
  changeCaculateMode: PropTypes.func.isRequired,
  tool: PropTypes.number.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  calcBrands: PropTypes.array.isRequired,
  qType: PropTypes.string.isRequired
};

export default ToolBar;

const Container = styled.div`
  margin-left: 60px;
`;

const customizeIcon = icon => styled(icon)`
  fill: ${white};
  margin-left: -3px;
  margin-top: 3px;
  &:hover {
    fill: ${white};
  }
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  background: ${props => (props.enable ? props.theme.default.headerButtonActiveBgColor : "transparent")};
  border-color: ${props => props.theme.default.headerButtonBorderColor};
  height: 40px;
  width: 40px;

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
