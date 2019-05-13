import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";

import { test } from "@edulastic/constants";
import { white } from "@edulastic/colors";
import CalculatorMenu from "./CalculatorMenu";

import { IconCursor, IconInRuler, IconCalculator, IconClose, IconProtactor, IconScratchPad } from "@edulastic/icons";
const { calculatorTypes } = test;
class ToolBar extends Component {
  toolbarHandler = value => {
    const { changeMode, changeTool } = this.props;

    changeTool(value);
    if (value === 5) {
      changeMode(true, value);
    } else {
      changeMode(false, value);
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
    const { settings, calcBrands, tool } = this.props;
    const { calcType } = settings;

    return (
      <Container>
        <StyledButton enable={tool === 0} onClick={() => this.toolbarHandler(0)}>
          <CursorIcon />
        </StyledButton>

        <StyledButton enable={tool === 1} onClick={() => this.toolbarHandler(1)}>
          <InRulerIcon />
        </StyledButton>
        {calcType !== calculatorTypes.NONE && (
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
        )}

        <StyledButton enable={tool === 3} onClick={() => this.toolbarHandler(3)}>
          <CloseIcon />
        </StyledButton>

        <StyledButton enable={tool === 4} onClick={() => this.toolbarHandler(4)}>
          <ProtactorIcon />
        </StyledButton>
        <StyledButton enable={tool === 5} onClick={() => this.toolbarHandler(5)}>
          <ScratchPadIcon />
        </StyledButton>
      </Container>
    );
  }
}

ToolBar.propTypes = {
  changeMode: PropTypes.func.isRequired,
  changeCaculateMode: PropTypes.func.isRequired,
  tool: PropTypes.number.isRequired,
  changeTool: PropTypes.func.isRequired
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
  background: ${props => (props.enable ? "#00b0ff" : "transparent")};
  height: 40px;
  width: 40px;

  &:focus,
  &:hover {
    background: ${props => (props.enable ? "#00b0ff" : "transparent")};
  }
`;

const CursorIcon = customizeIcon(IconCursor);

const InRulerIcon = customizeIcon(IconInRuler);

const CaculatorIcon = customizeIcon(IconCalculator);

const CloseIcon = customizeIcon(IconClose);

const ProtactorIcon = customizeIcon(IconProtactor);

const ScratchPadIcon = customizeIcon(IconScratchPad);
